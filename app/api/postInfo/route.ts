import { MongoClient } from 'mongodb';

interface data {
    IdDoESP: string
    temperatura: number
    umidade: number
}

export async function POST(request: Request) {
  const client = new MongoClient(process.env.MONGODB_URI!);
  
  try {
    // Conecte-se ao banco de dados
    await client.connect();
    
    // Obtenha os dados da requisição
    const data = await request.json() as data;

    const sendData = {
        temperatura: data.temperatura,
        umidade: data.umidade,
        data: new Date()
    }
    
    // Insira os dados no banco de dados
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection(data.IdDoESP).insertOne(sendData);
    
    return new Response(JSON.stringify({ insertedId: result.insertedId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error("Error occurred:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    // Feche a conexão com o banco de dados
    await client.close();
  }
}
