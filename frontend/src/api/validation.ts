import { z } from "zod"

export async function validateResponse<Schema extends z.ZodTypeAny>(requestPromise: Promise<{ data: any }>, schema: Schema): Promise<z.infer<Schema> | undefined> {
    try {
        const response = await requestPromise
        return await schema.parseAsync(response.data)
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod validation failed:", error.format())
        } else {
            console.error("Unknown error occured with request: ", error)
        }
    }
}

export function validateResponseSync<Schema extends z.ZodTypeAny>(response: object, schema: Schema): z.infer<Schema> | undefined {
    try {
        return schema.parse(response)
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod validation failed:", error.format())
        } else {
            console.error("Unknown error occured with request: ", error)
        }
    }
}