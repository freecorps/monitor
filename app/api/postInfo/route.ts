import MongoDB from '../../mongo/mongo';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const mongoDB = new MongoDB(process.env.MONGODB_URI!, process.env.MONGODB_DB!);
        await mongoDB.adicionarOuAtualizarDadosDoESP(data.IdDoESP, data.readings, data.key);

        return new Response(JSON.stringify({ message: 'Dados inseridos/atualizados com sucesso!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error("Error occurred:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}