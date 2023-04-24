import express, {Request, Response} from "express";
import dotenv from "dotenv"

dotenv.config();

import {gql} from "graphql-request";
import {client} from "./client";

const app = express();


const port = process.env.PORT || 2000;
app.use(express.json());

app.post('/add-user', async (req: Request, res: Response) => {
    const {name, password} = req.body as Record<string, string>;
    const document = gql`
        mutation addUser($user: user_insert_input!) {
            insert_user_one(object: $user) {
                id
            }
        }
    `;

    const {insert_user_one}: any = await client.request(document, {
        user: {
            name,
            password
        }
    });
    const {id: userId} = insert_user_one;
    return res.json({userId})
});

app.post('/update/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    const {name, password} = req.body as Record<string, string>;
    const document = gql`
        mutation updateUser($id: Int!, $name: String!, $password: String!) {
            update_user(
                where: {id : { _eq: $id }},
                _set: {name: $name, password: $password}
            ) {
                affected_rows
                returning {
                    id
                    name
                    password
                }
            }
        }
    `;

    const {update_user}: any = await client.request(document, {
        id,
        name,
        password
    });

    const {id: userId} = update_user;
    return res.json({userId, name, password})

});

app.delete('/delete/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    const document = gql`
        mutation updateUser($id: Int!) {
            delete_user(
                where: {id : { _eq: $id }},
            ) {
                affected_rows
            }
        }
    `;
    const {delete_user}: any = await client.request(document, {
        id,
    });
    const {id: userId} = delete_user;
    return res.json({userId})
});

app.get('/user/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    console.log({id})
    const document: string = gql`
        query getUserByName($id: Int!) {
            user(where: {id: { _eq: $id}}) {
                id
                name
                password
            }
        }
    `;

    const {user}: any = await client.request(document, {id});

    if (!user) return res.json({error: "not found"})

    return res.json(user)
})


app.listen(port, () => {
    console.log(`Auth server running on port ${port}.`);
});
