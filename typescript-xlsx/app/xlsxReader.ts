import { IAdmin, DisplayWaybill, temperatureEnum, waybillStatusEnum, transportCodesEnum, chargedToEnum } from "@/src/utils/interfaces";

const xlsx = require("xlsx");

type xlsxData = {
    registrationNumber: string,
    driver: string,
    company: string,
    date: string,
    routeNumber: number,
    sender: string,
    pickupLocation: string,
    parcelCount: number,
    temperature: string,
    palletSpaces: number,
    grossWeight: number,
    receiver: string,
    deliveryAddress: string,
    deliveryTime: string,
    referenceNumber: number,
    pickupTime: string,
    deliveryLocation: string,
    comments: string
}

const dataHeaders = [
    "registrationNumber",
    "driver",
    "company",
    "date",
    "routeNumber",
    "sender",
    "pickupLocation",
    "parcelCount",
    "temperature",
    "palletSpaces",
    "grossWeight",
    "receiver",
    "deliveryAddress",
    "deliveryTime",
    "referenceNumber",
    "pickupTime",
    "deliveryLocation",
    "comments"
]

const readExcelFile = async (path: string, rangeStart: number, rangeEnd: number, sheetNumber: number) => {
    try {
        const file = xlsx.readFile(path);
        let data: xlsxData[] = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[sheetNumber-1]], {range: {s: {c: 0, r: rangeStart-1 }, e: {c: 17, r: rangeEnd-1 }},skipHeader: true, header: dataHeaders, defval:""})
        
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

const validateDate = (val: xlsxData) => {
    const [ day, month, year ] = val.date.split(".");
    const [ pickUpHour, pickUpMinute ] = val.pickupTime.split(":");
    let [ deliveryHour, deliveryMinute ] = val.deliveryTime.split(":");

    const completePickUpDate: Date = new Date(+year, +month -1, +day, +pickUpHour, +pickUpMinute)
    const completedeliveryDate: Date = new Date(+year, +month -1, +day, +deliveryHour, +deliveryMinute)
    
    return { completePickUpDate, completedeliveryDate }
}

const validateTemp = (val: xlsxData): temperatureEnum => { 
    if (val.temperature === "Freeze" || val.temperature === "Frys") {
       return temperatureEnum.FREEZE 
    }
    else if (val.temperature === "Cool" || val.temperature === "Kjøl") {
        return temperatureEnum.COLD
    }
    else {
        return temperatureEnum.ROOM
    }
}

export const waybillConstructor = async(path: string, rangeStart: number, rangeEnd: number, sheetNumber: number, adminUser: IAdmin): Promise<DisplayWaybill[]> => {
    const waybillArr: DisplayWaybill[] = []

    const data: xlsxData[] | undefined = await readExcelFile(path, rangeStart, rangeEnd, sheetNumber);
    
    if (data === undefined) {
        throw new Error("can not find");
    } 
    
    if (data.length > 50) {
        throw new Error("tooo manyyy");
    }

    data.forEach((val) => {
        const { completePickUpDate, completedeliveryDate } = validateDate(val);

        const temperatureVal: temperatureEnum = validateTemp(val);  
       

        waybillArr.push({
            transportFirmName: adminUser.transportFirm,
            referenceNumber: val.referenceNumber,
            routeNumber: val.routeNumber,
            receiver: {
                name: val.receiver,
                address: {
                    street1: val.deliveryAddress,
                    street2: "",
                    city: val.deliveryLocation,
                    state: "",
                    country: "",
                    zip: ""
                },
                customerID: undefined,
                signature: {
                    name: "",
                    time: undefined
                }
            },
            sender: {
                name: val.sender,
                address: {
                    street1: "",
                    street2: "",
                    city: val.pickupLocation,
                    state: "",
                    country: "",
                    zip: ""
                },
                customerID: undefined,
                signature: {
                    name: "",
                    time: undefined
                }
            },
            pickupTime: completePickUpDate,
            deliveryTime: completedeliveryDate,
            pickUpDriver: {
                id: undefined,
                signature: undefined,
                name: val.driver,
                regNumber: val.registrationNumber
            },
            deliveryDriver: {
                id: undefined,
                signature: undefined,
                name: val.driver,
                regNumber: val.registrationNumber
            },
            chargedTo: chargedToEnum.sender,
            transportCodes: transportCodesEnum.A,
            packageCount: val.parcelCount,
            volume: undefined,
            temperature: temperatureVal,
            measurements: undefined,
            grossWeight: val.grossWeight,
            palletCount: undefined,
            palletSpaces: val.palletSpaces,
            dangerous: false,
            reloading: true,
            price: undefined,
            extraCharge: "",
            allCargo: [],
            allComments: [{
                author: adminUser.name,
                description: val.comments,
                time: new Date()
            }],
            archived: false,
            status: waybillStatusEnum.PLANNED,
            emergencyContact: adminUser.phoneNumber
        })
    })
    return waybillArr;

    //Sjekk på datalengde. Advarsel ved mange inputs
}