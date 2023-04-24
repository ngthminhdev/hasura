import { GraphQLClient } from "graphql-request";

const url: string = process.env.HASURA_GRAPHQL_ENDPOINT;
const token: string = process.env.HASURA_ADMIN_SECRET;
export const client = new GraphQLClient(url, {
    headers: { "x-hasura-admin-secret": token },
});
