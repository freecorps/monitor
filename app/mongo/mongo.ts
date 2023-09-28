import { MongoClient, Db, ObjectId } from 'mongodb';

interface ESPDocument {
    _id: string;
    readings: {
        temperatura: number;
        umidade: number;
        data: Date;
    }[];
}

export default class MongoDB {
    private readonly uri: string;
    private readonly dbName: string;

    constructor(uri: string, dbName: string) {
        this.uri = uri;
        this.dbName = dbName;
    }

    async listarESPs(): Promise<string[]> {
        const client = await MongoClient.connect(this.uri);
        const db: Db = client.db(this.dbName);
        const collection = db.collection('ESPs');
    
        const esps = await collection.find({}, { projection: { _id: 1 } }).toArray();
        client.close();
    
        return esps.map(esp => esp._id.toString());
    }    

    async dadosDoESP(espId: string): Promise<any> {
        const client = await MongoClient.connect(this.uri);
        const db: Db = client.db(this.dbName);
        const collection = db.collection('ESPs');
    
        const espData = await collection.findOne<ESPDocument>({ _id: espId } as any);
        client.close();
    
        return espData;
    }     

    async adicionarOuAtualizarDadosDoESP(espId: string, temperatura: number, umidade: number): Promise<void> {
        const client = await MongoClient.connect(this.uri);
        const db: Db = client.db(this.dbName);
        const collection = db.collection('ESPs');
    
        const currentData = {
            temperatura: temperatura,
            umidade: umidade,
            data: new Date()
        };
    
        const esp = await collection.findOne<ESPDocument>({ _id: espId } as any);
    
        if (esp) {
            // Atualizar os dados do ESP existente
            await collection.updateOne(
                { _id: new ObjectId(espId) },
                { $push: { readings: currentData } }
            );
        } else {
            // Criar um novo ESP e inserir os dados
            await collection.insertOne({
                _id: new ObjectId(espId),
                readings: [currentData]
            });
        }
    
        client.close();
    }        
}
