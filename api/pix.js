
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, cpf, email, phone, amount, productName, referenceId } = req.body;

  try {
    const apiKey = process.env.PODPAY_API_KEY;
    if (!apiKey) {
      console.error("ERRO: Variável de ambiente PODPAY_API_KEY não configurada");
      return res.status(500).json({ error: 'Erro de configuração do servidor (Podpay API Key)' });
    }

    const orderReference = referenceId || `PEDIDO-${Date.now()}`;
    const amountInCents = Math.round(amount * 100);

    // Payload para Podpay (conforme documentação /v1/transactions)
    const payload = {
      paymentMethod: "pix",
      amount: amountInCents,
      externalId: orderReference,
      description: productName || "Pedido Vapex",
      customer: {
        name: name,
        email: email,
        phone: phone.replace(/\D/g, ""),
        document: {
          type: "cpf",
          number: cpf.replace(/\D/g, "")
        }
      },
      items: [
        {
          title: productName || "Pedido Vapex",
          unitPrice: amountInCents,
          quantity: 1,
          tangible: true
        }
      ]
    };

    console.log(`Gerando PIX Podpay - Valor: ${amount} - Pedido: ${orderReference}`);

    const response = await fetch("https://api.podpay.app/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "X-Idempotency-Key": orderReference
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("--- RESPOSTA PODPAY ---", responseData);

    const data = responseData.data || responseData;

    if (response.ok && data.status !== 'failed') {
      // Mapeando a resposta da Podpay para o formato esperado pelo frontend
      return res.status(200).json({
        status: "success",
        transaction_id: data.id || data.transaction_id,
        reference: data.externalId || data.external_id || orderReference,
        pix_code: data.pixQrCode || data.pix?.qrcodeText || data.pix_code || data.copy_paste,
        pix_qr_code: data.pixQrCodeBase64 || data.pix?.qrcodeBase64 || data.pix_qr_code || data.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data.pixQrCode || data.pix?.qrcodeText || data.pix_code || data.copy_paste)}`,
        amount: amount,
      });
    } else {
      const errorMsg = data.failedReason || data.message || data.error || "Falha ao processar o pagamento com Podpay";
      console.error("Erro na resposta da Podpay:", errorMsg);
      return res.status(400).json({
        error: errorMsg
      });
    }
  } catch (error) {
    console.error("Erro interno na API de PIX (Podpay):", error);
    return res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
}
