// ConfiguraciÃ³n inicial

import { createAuthenticatedClient, isFinalizedGrant } from "@interledger/open-payments";
import fs from "fs";
import Readline from "readline/promises";
import db from './conexion.js';

async function obtenerEmpleados() {
    const connection = await db.getConnection(); // Obtiene una conexión del pool
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM empleados');
        console.log('Empleados:', rows);


        (async () => {
            const privateKey = fs.readFileSync("private.key", "utf8");
            const client = await createAuthenticatedClient({
                walletAddressUrl: "https://ilp.interledger-test.dev/acc",
                privateKey: "private.key",
                keyId: "156b45e6-d917-4062-a0a5-2660dc76b91f"
            })
            // me parece que entonces es un doble metodo

            // 1. Obtener una concesiÃ³n para un pago entrante)
            const sendingWalletAddress = await client.walletAddress.get({
                url: "https://ilp.interledger-test.dev/wall1"
            });

            // ciclo que va a hacer todo el procedimiento

            for (let i = 0; i < 16; i++) {
                for (const url of rows) {

                    const receivingWalletAddress = await client.walletAddress.get({
                        //url: "https://ilp.interledger-test.dev/wall2"
                        url: url["payment_pointer"]
                    });

                    console.log(sendingWalletAddress, receivingWalletAddress);

                    // 2. Obtener una concesiÃ³n para un pago entrante
                    const incomingPaymentGrant = await client.grant.request(
                        {
                            url: receivingWalletAddress.authServer,
                        },
                        {
                            access_token: {
                                access: [
                                    {
                                        type: 'incoming-payment',
                                        actions: ['create'],
                                    },
                                ],
                            },
                        },
                    );

                    if (!isFinalizedGrant(incomingPaymentGrant)) {
                        throw new Error("Se espera que finalice la concesion")
                        //console.log("La concesion no ha terminado")
                    }

                    console.log("\n");
                    console.log(incomingPaymentGrant);

                    // 3. Crear un pago entrante para el receptor
                    const incomingPayment = await client.incomingPayment.create(
                        {
                            url: receivingWalletAddress.resourceServer,
                            accessToken: incomingPaymentGrant.access_token.value,
                        },
                        {
                            walletAddress: receivingWalletAddress.id,
                            incomingAmount: {
                                assetCode: receivingWalletAddress.assetCode,
                                assetScale: receivingWalletAddress.assetScale,
                                value: "1000",
                            },
                        },
                    );

                    console.log({ incomingPayment });

                    // 4. Crear un concesiÃ³n para una cotizaciÃ³n
                    const quoteGrand = await client.grant.request(
                        {
                            url: sendingWalletAddress.authServer,
                        },
                        {
                            access_token: {
                                access: [
                                    {
                                        type: "quote",
                                        actions: ["create"],
                                    },
                                ],
                            },
                        },
                    );

                    if (!isFinalizedGrant(quoteGrand)) {
                        throw new Error("Se espera finalize la concesion");
                    }
                    console.log(quoteGrand);

                    // 5. Obtener una cotizaciÃ³n para el remitente
                    const quote = await client.quote.create(
                        {
                            url: receivingWalletAddress.resourceServer,
                            accessToken: quoteGrand.access_token.value,
                        },
                        {
                            walletAddress: sendingWalletAddress.id,
                            receiver: incomingPayment.id,
                            method: "ilp",
                        },
                    );

                    console.log({ quote });

                    // 6. Obtener una concesiÃ³n para un pago saliente
                    const outgoingPaymentGrant = await client.grant.request(
                        {
                            url: sendingWalletAddress.authServer,
                        },
                        {
                            access_token: {
                                access: [
                                    {
                                        type: "outgoing-payment",
                                        actions: ["create"],
                                        limits: {
                                            debitAmount: quote.debitAmount,
                                        },
                                        identifier: sendingWalletAddress.id,
                                    },
                                ],
                            },
                            interact: {
                                start: ["redirect"],
                            },
                        },
                    );

                    console.log({ outgoingPaymentGrant });

                    // 7. Continuar con la concesiÃ³n del pago saliente     ------
                    await Readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                    }).question("Presione enter para continuar con el pago saliente...");

                    // 8. Finalizar la concesiÃ³n del pago saliente
                    const finalizedOutgoingPaymentGrant = await client.grant.continue({
                        url: outgoingPaymentGrant.continue.uri,
                        accessToken: outgoingPaymentGrant.continue.access_token.value,
                    });
                    if (!isFinalizedGrant(finalizedOutgoingPaymentGrant)) {
                        throw new Error("Se espera finalize la cocesion");
                    }

                    // 9. Continuar con la cotizaciÃ³n de pago saliente
                    const outgoingPayment = await client.outgoingPayment.create(
                        {
                            url: sendingWalletAddress.resourceServer,
                            accessToken: finalizedOutgoingPaymentGrant.access_token.value,
                        },
                        {
                            walletAddress: sendingWalletAddress.id,
                            quoteId: quote.id,
                        },
                    );
                    console.log({ outgoingPayment });

                };
            }
        })();


    } catch (error) {
        console.error('Error al obtener empleados:', error);
    } finally {
        connection.release(); // Libera la conexión de vuelta al pool
    }
}

/*
const urlReceivingAcounts = [
    "https://ilp.interledger-test.dev/wall2",
    "https://ilp.interledger-test.dev/platzi-star",
    "https://ilp.interledger-test.dev/f2145385"
];
*/

const urlReceivingAcounts = obtenerEmpleados()

// a. Importar dependencias y configurar el cliente, cuenta del usuario que va a realizar los pagos
