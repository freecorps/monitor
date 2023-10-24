import MongoDB from '../../mongo/mongo';

export async function POST(request: Request) {
    const body = await request.json();
    const { id } = body;

    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing id' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const mongoDB = new MongoDB(process.env.MONGODB_URI_READ!, process.env.MONGODB_DB!);
    const dados = await mongoDB.dadosDoESP(id);

    if (!dados) {
        return new Response(JSON.stringify({ error: 'id not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify(dados.readings), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
