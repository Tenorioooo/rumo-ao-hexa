export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Permite GET com query params ou POST com body
  const transactionId = req.query.transactionId || req.body?.transactionId;
  const orderId = req.query.orderId || req.body?.orderId;

  if (!transactionId) {
    return res.status(400).json({ error: 'transactionId is required' });
  }

  try {
    const apiKey = process.env.VENO_API_KEY;
    const utmifyToken = process.env.UTMIFY_TOKEN || 'sv1xSNuNzZsX0KSNewIqzrgQpVE4BUAczl4z';

    if (!apiKey) {
      return res.status(500).json({ error: 'Erro de configuração do servidor' });
    }

    console.log(`[CheckPayment] Consultando transação ${transactionId} na Veno...`);

    // Consulta o status diretamente da API da Veno Payments
    const venoResponse = await fetch(`https://beta.venopayments.com/api/v1/pix/${transactionId}`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    if (!venoResponse.ok) {
      const errText = await venoResponse.text();
      console.error(`[CheckPayment] Erro ao consultar Veno: ${errText}`);
      return res.status(400).json({ approved: false, error: 'Falha ao consultar transação na Veno' });
    }

    const data = await venoResponse.json();
    console.log(`[CheckPayment] Resposta da Veno:`, JSON.stringify(data, null, 2));

    const status = String(data.status || '').toLowerCase();
    const isPaid = status === 'paid' || status === 'approved' || status === 'completed';

    if (isPaid) {
      console.log(`[CheckPayment] Transação paga na Veno! Aprovando no Utmify...`);

      // Dispara aprovação para a Utmify para garantir rastreamento
      if (utmifyToken && orderId) {
        const utmifyPayload = {
          orderId: orderId,
          status: "approved",
          approvedDate: new Date().toISOString().replace('T', ' ').split('.')[0],
          paymentMethod: "pix",
          platform: "VenoPayments"
        };

        try {
          const utmifyResponse = await fetch("https://api.utmify.com.br/api-credentials/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-token": utmifyToken
            },
            body: JSON.stringify(utmifyPayload)
          });
          const utmifyResult = await utmifyResponse.json().catch(() => ({}));
          console.log(`[CheckPayment] Resposta da Utmify:`, utmifyResult);
        } catch (utmifyErr) {
          console.error(`[CheckPayment] Erro ao enviar para Utmify:`, utmifyErr);
        }
      }

      return res.status(200).json({ approved: true, status });
    }

    return res.status(200).json({ approved: false, status });
  } catch (error) {
    console.error("[CheckPayment] Erro interno:", error);
    return res.status(500).json({ error: error.message || "Erro interno" });
  }
}
