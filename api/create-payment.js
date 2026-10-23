export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método não permitido'
    });
  }

  try {

    const order = req.body;

    const items = order.items.map(item => ({
      quantity: item.quantity,
      price: item.unit_price_cents,
      description: item.name
    }));

    const response = await fetch(
      'https://api.checkout.infinitepay.io/links',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': process.env.INFINITEPAY_API_KEY
        },
        body: JSON.stringify({
          order_nsu: `PEDIDO-${Date.now()}`,
          redirect_url: 'https://casa-da-cuca.vercel.app/sucesso.html',
          items
        })
      }
    );

    const result = await response.json();

    return res.status(200).json({
      checkout_url:
        result.checkout_url ||
        result.url ||
        result.payment_url
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Erro ao criar pagamento'
    });
  }
}
