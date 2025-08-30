import Database from '../models/database.js';

export class generalController {
    static async load() {
        try {
            const data = await Database.getAllItens();
            return {
                view: 'home',
                data: data,
                message: "Loading Data."
            };
        } catch (error) {
            return {
                view: 'home error',
                message: error,
                data: JSON.stringify(await Database.getAllItens())
            };
        }
    }
    static async toggle(data) {
        try {
            await Database.toggleActive(data);
            return {
                view: 'toggleItem',
                isAuthenticated: true,
                message: "Updated successfully concluded."
            };
        } catch (error) {
            return {
                view: 'Not updated',
                message: error
            };
        }
    }
    static async new(data) {
        try {
            await Database.new(data);
            return {
                view: 'new',
                message: "New successfully Added!"
            };
        } catch (error) {
            return {
                view: 'Not Added',
                message: error
            };
        }
    }
    static async deleteItem(data) {
        try {
            await Database.delete(data);
            return {
                view: 'delete',
                message: "Deleted successfully!"
            };
        } catch (error) {
            return {
                view: 'Not Deleted',
                message: error
            };
        }
    }
}