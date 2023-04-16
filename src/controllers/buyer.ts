import { Request, Response } from 'express';
import {validationResult} from 'express-validator'
import { generateBuyerToken } from '../auth/buyerAuth';
import { addAddress, updateAddressDetails } from '../functions/addressFunctions';
import { 
    checkBuyerEmail, 
    checkBuyerPhoneNumber, 
    checkIfEntriesMatch, 
    confirmBuyerRetrievedPassword, 
    createBuyer, 
    deleteAccount, 
    deleteBuyerImage, 
    getBuyerByEmail, 
    getBuyerById, 
    getBuyerImageKey, 
    getFullBuyerDetails, 
    hashBuyerPassword,
    retrieveBuyerHashedPassword,
    saveBuyerImageUrlAndKey,
    updateBuyerAccountDetails,
    updatePassword
} from '../functions/buyerFunctions';
import { s3 } from '../util/image.config';
import { mail } from '../util/mail';

export async function signUpBuyer (req: Request, res: Response) {
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
        const buyer = await getBuyerByEmail(email)
        res.status(201).send({ 
            success: true,
            message : "Your account has been created successfully", 
            buyer}) 
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the buyer's account",
            error: error.message
        });
    };
};

export async function loginBuyer (req: Request, res: Response) {
    const errors = validationResult(req)
    try {
        if (!req.body.email || !req.body.password) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter email and password"
            });
            return;
        };
        const {email, password} = req.body;

        if (!errors.isEmpty()) {
            const error = errors.array()[0];
            if (error.param === 'email') {
                return res.status(400).json({success: false, message: 'Invalid email address. Please try again.'});
            }
        }

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
            message: "An error occurred while logging in buyer",
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
2
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

export async function resetBuyerPassword (req: Request, res: Response) {
    try {
        const buyer = await getBuyerById(req.buyer.id)
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
        await saveBuyerImageUrlAndKey(req.buyer.id, result.Key, result.Location)
        res.json({
            success: true, 
            message: "Profile picture uploaded", 
            key: result.Key,
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
    const imageKey = req.params.filename;
    try {
        // Retrieve the image from S3
        const downloadParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: imageKey,
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
    // const filename = req.params.filename;
    try {
        const imageKey = await getBuyerImageKey(req.buyer.id);
        if ( !imageKey ) {
            res.status(400).send({
                success: false,
                message: "Image does not exist"
            });
            return;
        };
        // Delete the image from S3
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: imageKey,
        };

        await s3.deleteObject(deleteParams).promise();
        await deleteBuyerImage(req.buyer.id)
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