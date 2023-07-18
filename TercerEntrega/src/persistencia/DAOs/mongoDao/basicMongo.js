

export default class BasicMongo {
    constructor(model) {
        this.model = model;
    }
    async findAll() {
        try {
            return await this.model.find();
        } catch (error) {
            return error;
        }
    }
    async findById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            return error;
        }
    }
    async findByIdAndPopulate(id, populateStr) {
        try {
            return await this.model.findById(id).populate(populateStr).lean();
        } catch (error) {
            return error;
        }
    }
    async findByIdAndUpdate(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data);
        } catch (error) {
            return error;
        }
    }
    async create(data) {
        try {
            return await this.model.create(data);
        } catch (error) {
            return error;
        }
    }
    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            return error;
        }
    }
    async findOneAndUpdate(filter, update, options) {
        try {
            return await this.model.findOneAndUpdate(filter,update,options)
        } catch (error) {
            
        }
    }
    async insertMany(data) {
        try {
            return await this.model.insertMany(data);
        } catch (error) {
            return error;
        }
    }
}