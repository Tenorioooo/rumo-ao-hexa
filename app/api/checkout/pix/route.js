import { NextResponse } from 'next/server';
import { sendUtmifyOrder } from '../../../../lib/utmify';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.amount) {
      return NextResponse.json({ error: 'Valor (amount) é obrigatório' }, { status: 400 });
    }

    // Se a API Key não estiver configurada no .env.local, usamos dados mockados para desenvolvimento
    if (!process.env.VENO_API_KEY) {
      console.warn("VENO_API_KEY não encontrada. Utilizando mock para teste.");
      
      // Simulando delay da rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      return NextResponse.json({
        id: "mock-123456789",
        status: "pending",
        amount: body.amount,
        qr_code_image: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021226870014br.gov.bcb.pix0136mock-chave-pix-copia-cola",
        pix_copy_paste: "00020101021226870014br.gov.bcb.pix0136mock-chave-pix-copia-cola0215simulacao12345520400005303986540510.005802BR5915MOCK VENO PAY6009SAO PAULO62070503***63041A2B"
      });
    }

    // Chamada real para a API da VenoPay
    const response = await fetch('https://beta.venopayments.com/api/v1/pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VENO_API_KEY}`
      },
      body: JSON.stringify({
        amount: body.amount,
        payer: body.payer,
        description: 'Compra Hexa Store',
        trackingParameters: body.trackingParameters
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro Veno API:', data);
      return NextResponse.json(
        { error: data.message || 'Erro ao processar pagamento com a VenoPay' },
        { status: response.status }
      );
    }

    // Enviar evento de PIX gerado para o UTMify (incluindo parâmetros de rastreamento)
    sendUtmifyOrder({
      id: data.id || data.transactionId,
      status: "generated",
      amount: body.amount,
      payer: body.payer,
      trackingParameters: body.trackingParameters
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro Interno Checkout PIX:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao gerar PIX' },
      { status: 500 }
    );
  }
}
