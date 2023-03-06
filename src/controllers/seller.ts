import {Request, Response} from 'express';
import { generateSellerToken } from '../auth/jwtAuth';
import { 
    addAddress,
    updateAddressDetails
} from '../functions/addressFunctions';
import {
    checkEmail,
    checkPhoneNumber,
    createSeller,
    hashPassword,
    checkIfEntriesMatch, 
    confirmRetrievedPassword, 
    getSellerByEmail, 
    getSellerById, 
    getFullSellerDetails, 
    retrieveHashedPassword, 
    updateSellerAccountDetails,
    deleteSellerAccount,
    saveSellerImageKey
} from '../functions/sellerFunctions'

import fs from 'fs';
import util from 'util';
import { uploadFile } from '../images/s3';
const unlinkFile = util.promisify(fs.unlink)

export async function signUpSeller (req: Request, res: Response) {
    try {
        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone_number || !req.body.street || !req.body.password) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter all required fields"
            });
            return;
        };

        const {first_name, last_name, email, phone_number, street, city, state, country, image_key, password} = req.body;

        if (await checkEmail(email)) { 
            res.status(400).send({ success: false, message: "Email already exists"}) 
            return;
        };
        if (await checkPhoneNumber(phone_number)) {
            res.status(400).send({ success: false, message: "Phone number already exists"}) 
            return;
        };

        const hashed_password = await hashPassword(password);
        const address = await addAddress({street, city, state, country});
        const address_id = address.id;

        await createSeller({address_id, first_name, last_name, email, phone_number, image_key, hashed_password});
        const seller = await getSellerByEmail(email)
        res.status(201).send({ success: true, message : "Your account has been created", seller})   
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error creating seller account',
            error: error.message
        });
    };
};

export async function loginSeller (req: Request, res: Response) {
    try {
        if (!req.body.email || !req.body.password) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter email and password"
            });
            return;
        };
        const {email, password} = req.body;

        const sellerDetails = await getSellerByEmail(email);
        if (!sellerDetails) {
            res.status(400).send({ success: false, message: "The email you entered does not exist"})
            return;
        };

        const collectedUserPassword = await retrieveHashedPassword(email)
        if (await confirmRetrievedPassword(password, collectedUserPassword) !== true) {
            res.status(400).send({ success: false, message: "You have entered an incorrect password"})
            return;
        };
        
        const seller = await getFullSellerDetails(sellerDetails.id, sellerDetails.address_id);
        const token = await generateSellerToken(seller);

        res.status(200).send({
            success: true,
            message: "You have successfully logged in",
            seller, 
            token
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error logging in seller',
            error: error.message
        });
    };
};

export async function updateSellerAccount(req: Request, res: Response) {
    try {
        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone_number || !req.body.street) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter all required fields"
            });
            return;
        };

        const {first_name, last_name, email, phone_number, street, city, state, country, postal_code} = req.body;
        const seller = await getSellerById(req.seller.id)
        if ( await checkEmail (email) && ! checkIfEntriesMatch(seller.email, email)) {
            res.status(400).send({
                success: false,
                message: "Email already exists"
            });
            return;
        };
        if ( await checkPhoneNumber (phone_number) && ! checkIfEntriesMatch(seller.phone_number, phone_number)) {
            res.status(400).send({
                success: false,
                message: "Phone number already exists"
            })
            return;
        };

        await updateSellerAccountDetails(req.seller.id, first_name, last_name, email, phone_number)
        await updateAddressDetails(req.seller.address_id, street, city, state, country, postal_code)
        const new_details = await getFullSellerDetails(req.seller.id, req.seller.address_id)

        res.status(200).send({
            success: true,
            message: 'Your account has been updated!', 
            new_details
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error updating seller account',
            error: error.message
        });
    };
};

export async function getSellerAccount (req:Request, res: Response) {
    try {
        const seller = await getFullSellerDetails(req.seller.id, req.seller.address_id);
        if (!seller) {
            res.status(400).send({
                success: false,
                message: "Oops! You do not have an account, sign up to continue."
            });
            return;
        };
        res.status(200).send({ 
            success: true,
            seller
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error getting account details',
            error: error.message
        });
    };
};

export async function deleteAccount (req: Request, res: Response) {
    try {
        const deletedAccount = await deleteSellerAccount(req.seller.id)
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

export async function uploadSellerImage (req: Request, res: Response) {
    try {
        if (!req.file) {
            res.status(400).send({message: "Please select an image"});
            // throw new Error ("Please select an image");
            return;
        }

        const file: any = req.file
        console.log(file)
        const result = await uploadFile(file.buffer)
        console.log(result)
        await unlinkFile(file.path)
        await saveSellerImageKey(req.seller.id, result.Location)

        res.status(200).send({
            success: true,
            message: "Profile picture uploaded successfully"
        })
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: 'Could not upload photo',
            error: error.message
        })
    }
}