import { Gender } from "src/common/enums/gender.enum";

export class StudentProfileDto {
    studentName: string;
    schoolName: string;
    gender: Gender;
    parentName: string;
    dateOfBirth: string;
    parentPhoneNumber: string;
    classes: {
        className: string
    }[];
}