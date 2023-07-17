import { IWaybill } from "@/src/utils/interfaces";

const xlsx = require("xlsx");
//option origin, specify cell as starting point

const readExcelFile = async () => {
    try {
        const file = xlsx.readFile(`src/utils/ExampleSheet.xlsx`);
        let data: String[] = []
        const sheets = file.SheetNames
        for (let i = 0; i < sheets.length; i++) {
            const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]], {defval:""})

            temp.forEach((res: string) => {
                data.push(res)
            })
        }
        console.log(data);
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

const waybillConstructor = () => {
}

export const getData = async () => {
    const uploadedFile = await readExcelFile();
    console.log('uploadedFile :', uploadedFile);
    return uploadedFile;

}