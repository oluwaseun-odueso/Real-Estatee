import { Request, Response } from 'express';
import { generateBuyerToken } from '../auth/buyerAuth';
import { addAddress, updateAddressDetails } from '../functions/addressFunctions';
import { 
    checkBuyerEmail, 
    checkBuyerPhoneNumber, 
    checkIfEntriesMatch, 
    confirmBuyerRetrievedPassword, 
    createBuyer, 
    deleteAccount, 
    getBuyerByEmail, 
    getBuyerById, 
    getFullBuyerDetails, 
    hashBuyerPassword,
    retrieveBuyerHashedPassword,
    updateBuyerAccountDetails,
    updatePassword
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

export async function updateBuyerAccount(req: Request, res: Response) {
    try {
        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone_number || !req.body.street) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter all required fields"
            });
            return;
        };

        const {first_name, last_name, email, phone_number, street, city, state, country, postal_code} = req.body;
        const buyer = await getBuyerById(req.buyer.id)
        if ( await checkBuyerEmail (email) && ! checkIfEntriesMatch(buyer.email, email)) {
            res.status(400).send({
                success: false,
                message: "Email already exists"
            });
            return;
        };
        if ( await checkBuyerPhoneNumber (phone_number) && ! checkIfEntriesMatch(buyer.phone_number, phone_number)) {
            res.status(400).send({
                success: false,
                message: "Phone number already exists"
            })
            return;
        };

        await updateBuyerAccountDetails(req.buyer.id, first_name, last_name, email, phone_number)
        await updateAddressDetails(req.buyer.address_id, street, city, state, country, postal_code)
        const new_details = await getFullBuyerDetails(req.buyer.id, req.buyer.address_id)

        res.status(200).send({
            success: true,
            message: 'Your account has been updated!', 
            new_details
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error updating buyer account',
            error: error.message
        });
    };
};

export async function getBuyerAccount (req: Request, res: Response) {
    try {
        const buyer = await getFullBuyerDetails(req.buyer.id, req.buyer.address_id);
        if (!buyer) {
            res.status(400).send({
                success: false,
                message: "Oops! You do not have an account, sign up to continue."
            });
            return;
        };
        res.status(200).send({ 
            success: true,
            buyer
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error getting buyer's account details",
            error: error.message
        });
    };
};

export async function deleteBuyerAccount (req: Request, res: Response) {
    try {
        const deletedAccount = await deleteAccount(req.buyer.id)
        if (deletedAccount === 1) { 
            res.status(200).send({
                success: true,
                message: "Your account has been deleted!"
            })
            return
        };
        res.status(400).send({
            success: false,
            message: "You do not have an account, sign up to create an account"
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Could not delete your account',
            error: error.message
        });
    };
};

export async function updateBuyerPassword (req: Request, res: Response) {
    try {
        if (!req.body.current_password || !req.body.new_password) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter your current password and a new password"
            });
            return;
        };
        
        const {current_password, new_password} = req.body;
        const collectedBuyerPassword = await retrieveBuyerHashedPassword(req.buyer.email)
        if (await confirmBuyerRetrievedPassword(current_password, collectedBuyerPassword) !== true) {
            res.status(400).send({ success: false, message: "Current password is incorrect"})
            return;
        };

        const new_hashed_password = await hashBuyerPassword(new_password);
        await updatePassword(req.buyer.id, new_hashed_password)
        res.status(200).send({
            success: true,
            message: 'Your password has been updated!', 
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: error.message
        });
    };
};