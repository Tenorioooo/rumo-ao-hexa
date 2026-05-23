// scripts/lib/utmify.js
import fs from 'fs';
import path from 'path';

export async function sendUtmifyOrder(orderData) {
  const apiKey = process.env.UTMIFY_API_TOKEN;

  if (!apiKey) {
    console.warn('UTMify API Token não configurado. Pulando rastreio de vendas.');
    return null;
  }

  try {
    const now = new Date().toISOString();
    const payload = {
      orderId: orderData.id || `order_${Date.now()}`,
      platform: "Web",
      paymentMethod: "pix",
      status: "waiting_payment",
      createdAt: now,
      approvedDate: now,
      value: orderData.amount,
      customer: {
        name: orderData.payer?.name || "Cliente",
        email: orderData.payer?.email || "cliente@email.com",
        phone: orderData.payer?.phone || "00000000000",
        document: orderData.payer?.document || "00000000000"
      },
      trackingParameters: {
        utm_source: orderData.trackingParameters?.utm_source ?? null,
        utm_medium: orderData.trackingParameters?.utm_medium ?? null,
        utm_campaign: orderData.trackingParameters?.utm_campaign ?? null,
        utm_content: orderData.trackingParameters?.utm_content ?? null,
        utm_term: orderData.trackingParameters?.utm_term ?? null
      },
      commission: {
        totalPriceInCents: orderData.amount,
        gatewayFeeInCents: 0,
        userCommissionInCents: 0
      },
      products: [
        {
          id: "generated",
          name: "Compra Hexa Store",
          planId: "generated",
          planName: "Compra Hexa Store",
          quantity: 1,
          priceInCents: orderData.amount
        }
      ]
    };

    console.log('UTMify payload →', payload);
    // Persist payload for later status updates
    try {
      const ordersDir = path.resolve(process.cwd(), 'orders');
      if (!fs.existsSync(ordersDir)) {
        fs.mkdirSync(ordersDir, { recursive: true });
      }
      const filePath = path.join(ordersDir, `${payload.orderId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
      console.log('Payload saved to', filePath);
    } catch (fsErr) {
      console.error('Failed to save payload file:', fsErr);
    }

    const response = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('Erro na integração UTMify:', data || response.statusText);
      return false;
    }

    console.log('Venda enviada com sucesso para o UTMify:', data);
    return true;
  } catch (error) {
    console.error('Erro ao enviar pedido para UTMify:', error);
    return false;
  }
}
