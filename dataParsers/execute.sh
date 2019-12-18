#!/bin/bash


python3.6 ./parseCurrentTransfers.py
python3.6 ./parseDebtPayment.py
python3.6 ./parseInvestmentOutgoings.py
python3.6 ./parseInvestmentTransfers.py
python3.6 ./parseLoansAndCapital.py
python3.6 ./parseStateBudgetOutcome.py

