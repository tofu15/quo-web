interface Rsp {
    success: boolean
    code: number
    message: string
    data: Object
}

export function Get(url: string): Promise<Rsp | Error> {
    return fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status)
        }
        return response.json()
    }).catch((error) => {
        return (error as Error)
    })
}

export function Post(url: string, json: Object): Promise<Rsp | Error> {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(json)
    }).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status)
        }
        return response.json()
    }).catch((error) => {
        return (error as Error)
    })
}

export function Put(url: string, json?: Object): Promise<Rsp | Error> {
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(json)
    }).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status)
        }
        return response.json()
    }).catch((error) => {
        return (error as Error)
    })
}

export function Delete(url: string): Promise<Rsp | Error> {
    return fetch(url, {
        method: 'DELETE'
    }).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status)
        }
        return response.json()
    }).catch((error) => {
        return (error as Error)
    })
}