import MongoDB from '../../mongo/mongo';

export async function GET(request: Request) {
    const mongoDB = new MongoDB("mongodb+srv://meteoro:readonly@cluster0.lhl5swf.mongodb.net/", "meteoro");
    const ids = await mongoDB.listarESPs();
    return new Response(JSON.stringify(ids), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
