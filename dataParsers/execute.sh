#!/bin/bash


python3.5 ./parseCurrentTransfers.py
python3.5 ./parseDebtPayment.py
python3.5 ./parseInvestmentOutgoings.py
python3.5 ./parseInvestmentTransfers.py
python3.5 ./parseLoansAndCapital.py
python3.5 ./parseStateBudgetOutcome.py

