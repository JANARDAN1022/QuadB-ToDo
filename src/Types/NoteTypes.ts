export interface Note {
    id: string;
    title:string;
    body:{
        content:string,
        style:string
    },
    Completed:boolean
}
export interface NoteState {
    Notes:Note[],
}

