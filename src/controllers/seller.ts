import {Request, Response} from 'express';
import {validationResult} from 'express-validator'
import { generateSellerToken } from '../auth/sellerAuth';
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
    confirmSellerRetrievedPassword, 
    getSellerByEmail, 
    getSellerById, 
    getFullSellerDetails, 
    retrieveSellerHashedPassword, 
    updateSellerAccountDetails,
    deleteSellerAccount,
    saveSellerImageKey,
    updatePassword
} from '../functions/sellerFunctions'
import { mail } from '../util/mail';
import { s3 } from "../image.config"
import dotenv from 'dotenv';

dotenv.config();

export async function signUpSeller (req: Request, res: Response) {
    const errors = validationResult(req)
    try {
        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone_number || !req.body.street || !req.body.password) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter all required fields"
            });
            return;
        };
        const {first_name, last_name, email, phone_number, street, city, state, country, image_key, password} = req.body;

        // Validate email and password
        if (!errors.isEmpty()) {
            const error = errors.array()[0];
            if (error.param === 'email') {
                return res.status(400).json({success: false, message: 'Invalid email address. Please try again.'});
            }
            if (error.param === 'password') {
                return res.status(400).json({success: false, message: 'Password must be at least 8 characters long, must contain at least one lowercase letter, one uppercase letter, one number and one special character.'});
            }
        }

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
            message: "An error occurred while creating the seller's account",
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

        const collectedSellerPassword = await retrieveSellerHashedPassword(email)
        if (await confirmSellerRetrievedPassword(password, collectedSellerPassword) !== true) {
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
            message: "An error occurred while logging in seller",
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
            message: "Error getting seller's account details",
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

export async function updateSellerPassword (req: Request, res: Response) {
    try {
        if (!req.body.current_password || !req.body.new_password) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter your current password and a new password"
            });
            return;
        };
        
        const {current_password, new_password} = req.body;
        const collectedSellerPassword = await retrieveSellerHashedPassword(req.seller.email)
        if (await confirmSellerRetrievedPassword(current_password, collectedSellerPassword) !== true) {
            res.status(400).json({ success: false, message: "Current password is incorrect"})
            return;
        };

        const new_hashed_password = await hashPassword(new_password);
        await updatePassword(req.seller.id, new_hashed_password)
        res.status(200).json({
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

export async function resetSellerPassword (req: Request, res: Response) {
    try {
        const buyer = await getSellerById(req.seller.id)
        await mail(buyer.email)
        res.status(200).send({
            success: true,
            message: "A reset token has been sent to your registered email"
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Could not process reset password',
            error: error.message
        });
    };
};

export async function uploadImage (req: Request, res: Response) {
    const file: any = req.file;
    if (!file) {
        res.status(400).json({ error: 'No image uploaded.' });
        return;
    }
    
    try {
        // Save the image to S3
        const filename = `${Date.now()}-${file.originalname}`;
        const fileStream = file.buffer;
        const contentType = file.mimetype;
        const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: filename,
        Body: fileStream,
        ContentType: contentType,
        };

        const result: any = await s3.upload(uploadParams).promise();
        res.json({
            success: true, 
            message: "Profile picture uploaded", 
            url: result.Location
        });
    } catch (error: any) {
        return res.status(500).json({ 
            success: false, 
            message: 'Error uploading image', 
            error: error.message
        });
    };
};

export async function getImage (req: Request, res: Response) {
    const filename = req.params.filename;
    try {
        // Retrieve the image from S3
        const downloadParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: filename,
        };
        const objectData = await s3.getObject(downloadParams).promise();
        const imageBuffer = objectData.Body;

        // Set the Content-Type header to the image's MIME type
        const contentType = objectData.ContentType;
        res.set('Content-Type', contentType);

        // Return the image
        res.send(imageBuffer);
    } catch (error: any) {
        return res.status(500).json({ 
            success: false, 
            message: 'Unable to get image',
            error: error.message
        });
    };
};

export async function deleteImage (req: Request, res: Response) {
    const filename = req.params.filename;
    try {
        // Delete the image from S3
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: filename,
        };

        await s3.deleteObject(deleteParams).promise();
        res.json({ 
            success: true, 
            message: 'Image deleted.' 
        });
    } catch (error: any) {
        return res.status(500).json({ 
            success: false, 
            message: 'Unable to delete image',
            error: error.message
        });    
    };
};