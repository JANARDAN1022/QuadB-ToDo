export interface Note {
    id: string;
    title:string;
    body:{
        content:string,
        style:string
    },
    Completed:boolean
    Createdon:string
    Updatedon:string
}
export interface NoteState {
    Notes:Note[],
}

