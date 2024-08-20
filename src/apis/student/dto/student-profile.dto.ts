export class StudentProfileDto {
    studentName: string;
    schoolName: string;
    gender: string;
    parentName: string;
    parentPhoneNumber: string;
    classes: {
        className: string
    }[];
}