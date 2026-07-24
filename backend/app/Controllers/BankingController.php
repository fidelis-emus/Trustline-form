<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\Banking;
use App\Models\AuditLog;

class BankingController {
    // Investment Units
    public function getUnits(): void {
        Response::success(Banking::getInvestmentUnits());
    }

    public function createUnit(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $id = Banking::createInvestmentUnit($input);
        Response::success(['id' => $id], 'Investment unit created', 201);
    }

    public function updateUnit(string $id): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        Banking::updateInvestmentUnit($id, $input);
        Response::success(null, 'Investment unit updated');
    }

    public function deleteUnit(string $id): void {
        Banking::deleteInvestmentUnit($id);
        Response::success(null, 'Investment unit deleted');
    }

    // Bank Accounts
    public function getAccounts(): void {
        Response::success(Banking::getBankAccounts());
    }

    public function createAccount(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $id = Banking::createBankAccount($input);
        Response::success(['id' => $id], 'Bank account created', 201);
    }

    public function updateAccount(string $id): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        Banking::updateBankAccount($id, $input);
        Response::success(null, 'Bank account updated');
    }

    public function deleteAccount(string $id): void {
        Banking::deleteBankAccount($id);
        Response::success(null, 'Bank account deleted');
    }

    // Officers
    public function getOfficers(): void {
        Response::success(Banking::getAccountOfficers());
    }

    public function createOfficer(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $id = Banking::createAccountOfficer($input);
        Response::success(['id' => $id], 'Account officer added', 201);
    }

    public function deleteOfficer(string $id): void {
        Banking::deleteAccountOfficer($id);
        Response::success(null, 'Account officer deleted');
    }
}
