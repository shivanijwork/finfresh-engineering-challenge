import { Component } from "react";
import api from "./Api";


class ApiRoutes extends Component {
    async register(data) {
        return api.post("/register", data);
    }
    async login(data) {
        return api.post("/login", data);
    }
    async getSummary() {
        return api.get("/transactions/summary");
    }

    async getFinancialHealth() {
        return api.get("/transactions/financial-health");
    }

    async getTransactions() {
        return api.get("/transactions");
    }

    async addTransaction(data) {
        return api.post("/transactions", data);
    }
    render() {
        return (
            <div>
                <>

                </>
            </div>
        );
    }
}


export default ApiRoutes;