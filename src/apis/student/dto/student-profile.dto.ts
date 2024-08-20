export class StudentProfileDto {
    studentName: string;
    schoolName: string;
    parentName: string;
    parentPhoneNumber: string;
    classes: {
        className: string
    }[];
}