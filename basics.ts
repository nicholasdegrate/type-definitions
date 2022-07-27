export type Values<T extends Record<string, string>> = T[keyof T]

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

export type Keys<T extends Record<string, T[keyof T]>> = keyof T

/*
 @example {} as Record<string, Record<string, any>[]>

 @return "Invalid" | 'Valid' | 'unknown'
*/
export type NestedValuesInHash<
    T extends Record<string, any>,
    P extends Keys<Values<T>[0]>
> = Values<{
    [K in keyof T]: T[K][number][P]
}>

/* 
	generics
*/
function pluck<DataType, keyType extends keyof DataType>(
    items: DataType[],
    key: keyType
): DataType[keyType][] {
    return items.map((item) => item[key])
}

const dogs = [
    { name: 'mimi', age: 12 },
    { name: 'LG', age: 4 },
]

interface BaseEvent {
    time: number
    user: string
}

interface EventMap {
    addToCart: BaseEvent & { quantity: number; productID: string }
}

function sendEvent<Name extends keyof EventMap>(
    name: string,
    data: EventMap[Name]
): void {
    console.log(name, data)
}

/* 
	utility-types
*/

interface MyUser {
    name: string
    id: string
    email?: string
}

type MyUserOptional = Partial<MyUser>

type JustEmailAndName = Pick<MyUser, 'email' | 'name'>

const merge = (user: MyUser, override: MyUserOptional): MyUser => {
    return {
        ...user,
        ...override,
    }
}

const mapById = (users: MyUser[]): Record<MyUser['id'], Omit<MyUser, 'id'>> => {
    return users.reduce((acc, v) => {
        const { id, ...other } = v

        return {
            ...acc,
            [id]: other,
        }
    }, {})
}

/* 
	readonly 
*/

interface Cat {
    readonly name: string
    breed: string
}

function makeCat(name: string, breed: string): Readonly<Cat> {
    return {
        name,
        breed,
    }
}

/* 
	 mapping Types
*/

interface DogInfo {
    name: string
    age: number
}

type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean
}

type Listeners<T> = {
    [Property in keyof T as `on${Capitalize<string & Property>}Change`]?: (
        newValue: T[Property]
    ) => void
}

function listenToObj<T>(obj: T, listeners: Listeners<T>): void {}

const lg: DogInfo = {
    name: 'lg',
    age: 23,
}

type DogInfoListeners = Listeners<DogInfo>

listenToObj(lg, {
    onNameChange: (v: string) => {},
    onAgeChange: (v: number) => {},
})

/* 
 	conditional types 
  */

interface PokemonResults {
    count: number
    next?: number
    previous?: string
    results: Record<string, { name: string; url: string }>[]
}

type FetchPokemonResult<T> = T extends undefined
    ? Promise<PokemonResults>
    : void

function fetchPokemon<T extends undefined | ((data: PokemonResults) => void)>(
    url: string,
    cb?: T
): FetchPokemonResult<T> {
    if (cb) {
        fetch(url)
            .then((res) => res.json())
            .then(cb)
        return undefined as FetchPokemonResult<T>
    } else {
        return fetch(url).then((res) => res.json()) as FetchPokemonResult<T>
    }
}

/* 
  
  ulitity types part 2
  */

type Name = {
    first: string
    last: string
}

function addFullName(name: Name): Name & { fullName: string } {
    return {
        ...name,
        fullName: `${name.first} ${name.last}`,
    }
}

function permuteRows<T extends (...args: any[]) => any>(
    iteratorFunc: T,
    data: Parameters<T>[0][]
): ReturnType<T>[] {
    return data.map(iteratorFunc)
}

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key]
}

let user = { name: '', age: 23 }

getProperty(user, 'name')
