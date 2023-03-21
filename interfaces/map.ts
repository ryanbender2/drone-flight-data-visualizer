export interface Path {
    /** Log and lad GPS data. */
    path: PathData
    /** Name of overall path. */
    name?: string
    /** Color of path. */
    color?: RGB
}

type RGB = [number, number, number] | [number, number, number, number]

export type PathData = [number, number][]
