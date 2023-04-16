import {Request, Response} from 'express';
import { addAddress, deletePropertyAddress, updateAddressDetails } from '../functions/addressFunctions';
import { deletePropertyFeatures } from '../functions/propertyFeaturesFunctions';
import { 
    checkIfSellerHasProperty,
    createProperty, 
    deleteSellerProperty, 
    getFullPropertyDetails, 
    getManyProperties, 
    getPropertyById, 
    QueryParam, 
    updatePropertyDetails
    } from '../functions/propertyFunctions';
import { 
    createPropertyImage, 
    deletePropertyImages, 
    getKeyArray
} from '../functions/propertyImagesFunctions';
import { s3 } from '../util/image.config';

export async function getProperties(req: Request, res: Response) {
    try {
        const queries: QueryParam = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 20,
            search: String(req.query.search) || "",
            filter: String(req.query.filter) || ""
        }
        const properties = await getManyProperties(queries)
        res.status(200).send({ 
            success: true,
            properties
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching properties.',
            error: error.message
        });
    };
}
export async function addProperty(req: Request, res: Response) {
    try {
        if (!req.body.description || !req.body.type || !req.body.street || !req.body.city || !req.body.state || !req.body.country || !req.body.price) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter all required fields"
            });
            return;
        };

        const {description, type, street, city, state, country, price} = req.body;
        const address = await addAddress({street, city, state, country});
        const address_id = address.id;
        const seller_id = req.seller.id
        const payment_status = "Available"
        const property = await createProperty({seller_id, address_id, description, type, price, payment_status})
        res.status(201).send({ success: true, message : "You have successfully put up a new property for sale", property})   
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error adding property.',
            error: error.message
        });
    };
};

export async function getProperty(req: Request, res: Response) {
    try {
        const property_id = parseInt(req.params.id, 10)
        const property = await getPropertyById(property_id)
        if (!property) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        };

        const propertyDetails = await getFullPropertyDetails(property_id, property.address_id)
        res.status(200).send({ 
            success: true,
            propertyDetails
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error adding property.',
            error: error.message
        });
    };
};

export async function updateProperty(req: Request, res: Response) {
    try {
        if (!req.body.description || !req.body.type || !req.body.street || !req.body.price) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter all required fields"
            });
            return;
        };

        const property_id = parseInt(req.params.id, 10)
        const property = await getPropertyById(property_id)
        if (! await checkIfSellerHasProperty(property_id, req.seller.id)) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        };

        const {description, type, street, city, state, country, postal_code, price} = req.body;
        await updatePropertyDetails(property_id, description, type, price)
        await updateAddressDetails(property.address_id, street, city, state, country, postal_code)
        const new_details = await getFullPropertyDetails(property_id, property.address_id)

        res.status(200).send({
            success: true,
            message: "Your property's details has been updated!", 
            new_details
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error updating property details.',
            error: error.message
        });
    };
};

export async function deleteProperty(req: Request, res: Response) {
    try {
        const property_id = parseInt(req.params.id, 10)
        if (!await checkIfSellerHasProperty(property_id, req.seller.id)) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        };

        const property = await getPropertyById(property_id)
        await deletePropertyAddress(property.address_id)
        await deletePropertyFeatures(property_id)
        await deleteSellerProperty(property_id, req.seller.id)
        res.status(200).send({
            success: true,
            message: "Property has been deleted!"
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting property.',
            error: error.message
        });
    };
};

export async function uploadImages (req: Request, res: Response) {
    const files: any = req.files;
    const property_id = parseInt(req.params.id, 10)
    try {
        let Keys: string[] = [];
        let Urls: string[] = [];
        if(files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const filename = `${Date.now()}-${files[i].originalname}`;
                const fileStream = files[i].buffer;
                const contentType = files[i].mimetype;
                const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: filename,
                Body: fileStream,
                ContentType: contentType,
                };

                const result: any = await s3.upload(uploadParams).promise();
                const image_key = result.Key
                const image_url = result.Location
                await createPropertyImage({property_id, image_key, image_url})
                Keys.push(result.Key);
                Urls.push(result.Location)
            }
        }
        res.json({
            success: true, 
            message: "Pictures uploaded", 
            keys: Keys,
            urls: Urls
        });
    } catch (error: any) {
        return res.status(500).json({ 
            success: false, 
            message: 'Error uploading image(s)', 
            error: error.message
        });
    }
};

export async function deleteImages (req: Request, res: Response) {
    const imageKeys: { Key: string }[] = req.body;
    try {
        // Delete the image from S3
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Delete: {
                Objects: imageKeys,
                Quiet: false
            }
        };
        
        s3.deleteObjects(deleteParams, (error, data) => {
            if (error) {
              res.status(500).json({ message: 'Error deleting images', error});
            } else {
              res.json({ message: 'Images deleted successfully' });
            }
          });
        
        const image_key_array: string[] = getKeyArray(imageKeys)
        await deletePropertyImages(image_key_array)
    } catch (error: any) {
        return res.status(500).json({ 
            success: false, 
            message: 'Unable to delete image',
            error: error.message
        });    
    };
};

// const imageKey = [
//     {user: "Umi"},
//     {user: "Kimi"},
//     {user: "Ikongbe"}
// ]

// const keyArray: string[] = []

// imageKey.forEach(object => {
//     keyArray.push(object['user'])
// })

// console.log(keyArray)