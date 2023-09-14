import { MongoClient, Db } from 'mongodb';

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

        const collections = await db.listCollections().toArray();
        const espCollections = collections
            .map(col => col.name)
            .filter(name => name.startsWith('ESP'));

        client.close();

        return espCollections;
    }

    async dadosDoESP(espCollectionName: string): Promise<any[]> {
        const client = await MongoClient.connect(this.uri);
        const db: Db = client.db(this.dbName);
        const collection = db.collection(espCollectionName);

        const result = await collection.find({}).toArray();
        client.close();

        return result;
    }
}
