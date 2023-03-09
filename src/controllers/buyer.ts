import { Request, Response } from 'express';
import { generateBuyerToken } from '../auth/buyerAuth';
import { addAddress, updateAddressDetails } from '../functions/addressFunctions';
import { 
    checkBuyerEmail, 
    checkBuyerPhoneNumber, 
    checkIfEntriesMatch, 
    confirmBuyerRetrievedPassword, 
    createBuyer, 
    getBuyerByEmail, 
    getBuyerById, 
    getFullBuyerDetails, 
    hashBuyerPassword,
    retrieveBuyerHashedPassword,
    updateBuyerAccountDetails
} from '../functions/buyerFunctions';

export async function signUpBuyer (req: Request, res: Response) {
    try {
        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone_number || !req.body.street || !req.body.password) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter all required fields"
            });
            return;
        };

        const {first_name, last_name, email, phone_number, street, city, state, country, image_key, password} = req.body;

        if (await checkBuyerEmail(email)) { 
            res.status(400).send({ success: false, message: "Email already exists"}) 
            return;
        };
        if (await checkBuyerPhoneNumber(phone_number)) {
            res.status(400).send({ success: false, message: "Phone number already exists"}) 
            return;
        };

        const hashed_password = await hashBuyerPassword(password);
        const address = await addAddress({street, city, state, country});
        const address_id = address.id;

        await createBuyer({address_id, first_name, last_name, email, phone_number, image_key, hashed_password});
        const seller = await getBuyerByEmail(email)
        res.status(201).send({ success: true, message : "Your account has been created", seller}) 
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error creating buyer's account",
            error: error.message
        });
    };
};

export async function loginBuyer (req: Request, res: Response) {
    try {
        if (!req.body.email || !req.body.password) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter email and password"
            });
            return;
        };
        const {email, password} = req.body;

        const buyerDetails = await getBuyerByEmail(email);
        if (!buyerDetails) {
            res.status(400).send({ success: false, message: "The email you entered does not exist"})
            return;
        };

        const collectedBuyerPassword = await retrieveBuyerHashedPassword(email)
        if (await confirmBuyerRetrievedPassword(password, collectedBuyerPassword) !== true) {
            res.status(400).send({ success: false, message: "You have entered an incorrect password"})
            return;
        };
        
        const buyer = await getFullBuyerDetails(buyerDetails.id, buyerDetails.address_id);
        const token = await generateBuyerToken(buyer);

        res.status(200).send({
            success: true,
            message: "You have successfully logged in",
            buyer, 
            token
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error logging in buyer',
            error: error.message
        });
    };
};
