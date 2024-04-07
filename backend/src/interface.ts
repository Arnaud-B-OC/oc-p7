
interface IUser {
    email: string
    password: string
}

interface IBook {
    _id: string
    userId: string
    title: string
    author: string
    imageUrl: string
    year: number
    genre: string
    ratings: {
        userId: string
        grade: number
    }[]
    averageRating: number
}

interface BookOptions {
    userId: string
    title: string
    author: string
    imageUrl: string
    year: number
    genre: string
    ratings: {
        userId: string
        grade: number
    }[]
    averageRating: number
}
interface BookEditOptions {
    title: string
    author: string
    imageUrl: string
    year: number
    genre: string
}