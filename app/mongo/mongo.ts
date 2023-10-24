import { MongoClient, Db, ObjectId } from 'mongodb';

interface ESPDocument {
    _id: string;
    readings: {
        data: any;
        timestamp: Date;
    }[];
    key?: string;
    lat?: number;
    long?: number;
}

export default class MongoDB {
    private readonly uri: string;
    private readonly dbName: string;

    constructor(uri: string, dbName: string) {
        this.uri = uri;
        this.dbName = dbName;
    } 

    async dadosDoESP(espId: string): Promise<any> {
        const client = await MongoClient.connect(this.uri);
        const db: Db = client.db(this.dbName);
        const collection = db.collection('ESPs');
    
        const espData = await collection.findOne<ESPDocument>({ _id: espId } as any);
        client.close();
    
        return espData;
    }     

    async adicionarOuAtualizarDadosDoESP(espId: string, readingsData: any, key?: string): Promise<void> {
        const client = await MongoClient.connect(this.uri);
        const db: Db = client.db(this.dbName);
        const collection = db.collection('ESPs');
        const currentData = {
            data: readingsData,
            timestamp: new Date()
        };
    
        const esp = await collection.findOne<ESPDocument>({ _id: espId } as any);

        if (esp) {
            if (esp.key && esp.key !== key) {
                throw new Error("Chave de autenticação inválida.");
            }
            await collection.updateOne(
                { _id: espId as any },
                { $push: { readings: currentData } }
            );
        } else {
            const generatedKey = key || this.generateRandomKey();
            await collection.insertOne({
                _id: espId as any,
                readings: [currentData],
                key: generatedKey
            });
        }
    
        client.close();
    }
    
    private generateRandomKey(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }   
}
