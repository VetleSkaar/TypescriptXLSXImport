import { IAdmin, DisplayWaybill, temperatureEnum } from "@/src/utils/interfaces";

const xlsx = require("xlsx");
//option origin, specify cell as starting point



type xlsxData = {
    registrationNumber: string,
    driver: string,
    company: string,
    date: string,
    routeNumber: number,
    sender: string,
    pickupLocation: string,
    parcelCount: number,
    temperature: temperatureEnum,
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

const readExcelFile = async (rangeStart: number, rangeEnd: number, sheetNumber: number) => {
    try {
        const file = xlsx.readFile(`src/utils/ExampleSheet.xlsx`);
        let data: xlsxData[] = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[sheetNumber-1]], {range: {s: {c: 0, r: rangeStart-1 }, e: {c: 17, r: rangeEnd-1 }},skipHeader: true, header: dataHeaders, defval:""})

        return data;
    }
    catch (err) {
        console.log(err);
    }
}

const waybillConstructor = (data: xlsxData[], adminUser: IAdmin) => {
    const waybillArr: DisplayWaybill[] = []

    data.forEach((val) => {
        const [ day, month, year ] = data[0].date.split(".");
        const [ pickUpHour, pickUpMinute ] = data[0].pickupTime.split(":");
        let [ deliveryHour, deliveryMinute ] = data[0].deliveryTime.split(":");

        const fullPickUpDate: Date = new Date(+year, +month -1, +day, +pickUpHour, +pickUpMinute)
        const fulldeliveryDate: Date = new Date(+year, +month -1, +day, +deliveryHour, +deliveryMinute)

        waybillArr.push({
            transportFirm: adminUser.transportFirm,
            refrenceNumber: val.referenceNumber,
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
            pickupTime: fullPickUpDate,
            deliveryTime: fulldeliveryDate,
            pickUpDriver: {
                id: undefined,
                signature: undefined
            },
            deliveryDriver: {
                id: new ObjectId,
                signature: undefined
            },
            chargedTo: "",
            transportCodes: "",
            packageCount: 0,
            volume: 0,
            temperature: "",
            measurements: "",
            grossWeight: 0,
            palletCount: 0,
            palletSpaces: 0,
            dangerous: false,
            reloading: false,
            price: 0,
            extraCharge: "",
            allCargo: [],
            allComments: [],
            archived: false,
            status: "",
            emergencyContact: ""
        })
    })

    //Sjekk på datalengde. Advarsel ved mange inputs
}

export const getData = async () => {
    const uploadedFile = await readExcelFile(18, 20, 1);
}