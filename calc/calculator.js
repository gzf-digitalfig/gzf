// Global state
const state = {
    currentStep: 1,
    totalSteps: 7,
    calculationDate: new Date().toISOString().split('T')[0],
    nisabGBP: 0,
    goldPriceGBP: 0,
    silverPriceGBP: 0,
    selectedCurrency: 'GBP',
    currencies: [],
    exchangeRates: {},
    
    // Form data
    goldItems: [],
    silverInputMode: 'weight',
    silverWeight: '',
    silverValue: '',
    cashInHand: '',
    bankAccounts: [],
    crypto: [],
    digitalWallets: [],
    isas: [],
    stocksAndShares: [],
    otherAssets: [],
    
    includeBusinessAssets: false,
    businessStockValue: '',
    businessInvoices: '',
    businessAccounts: [],
    
    receivables: [],
    
    pensionType: 'NotSure',
    dcAccess: 'Locked',
    pensionValue: '',
    includeDCPension: false,
    
    creditCards: [],
    personalLoans: [],
    otherBills: [],
    studentLoans: '',
    carFinance: '',
    councilTax: '',
    mortgageOrRent: '',
    businessTaxes: '',
    businessLoans: [],
    overdrafts: [],
    invoicesOwed: []
};

// Fallback data
const fallbackCurrencies = [
    { code: 'GBP', name: 'British Pound' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'QAR', name: 'Qatari Riyal' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'OMR', name: 'Omani Rial' },
    { code: 'BHD', name: 'Bahraini Dinar' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'EGP', name: 'Egyptian Pound' }
];

const fallbackRates = {
    'GBP': 1,
    'USD': 1.27,
    'EUR': 1.17,
    'CAD': 1.78,
    'AUD': 1.98,
    'SAR': 4.76,
    'AED': 4.66,
    'PKR': 353,
    'INR': 107,
    'BDT': 156,
    'QAR': 4.62,
    'KWD': 0.39,
    'OMR': 0.49,
    'BHD': 0.48,
    'MYR': 5.67,
    'IDR': 20234,
    'SGD': 1.71,
    'ZAR': 23.12,
    'TRY': 43.67,
    'EGP': 62.58
};

// Global variable to track selected donation type
let selectedDonationType = 'zakat'; // Default to Zakat

// ✅ SECURITY: HTML sanitization helper
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ✅ SECURITY: Validate numeric input
function sanitizeNumber(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) return 0;
    return num;
}

// Initialize
async function init() {
    try {
        // Set defaults
        state.goldPriceGBP = 55.50;
        state.silverPriceGBP = 0.74;
        state.nisabGBP = state.silverPriceGBP * 612.36;
        state.currencies = fallbackCurrencies;
        state.exchangeRates = fallbackRates;

        // Try to fetch live data - USING FULL EXTERNAL URLS
        try {
            const priceResponse = await fetch('https://gloucesterprayertimes.com/zakatapp/nisab_history.php');
            if (priceResponse.ok) {
                const priceHistory = await priceResponse.json();
                if (Array.isArray(priceHistory) && priceHistory.length > 0) {
                    const todayPrice = priceHistory[0];
                    
                    if (todayPrice) {
                        state.goldPriceGBP = parseFloat(todayPrice.gold_price_gbp);
                        state.silverPriceGBP = parseFloat(todayPrice.silver_price_gbp);
                        state.nisabGBP = state.silverPriceGBP * 612.36;
                        console.log('✅ Loaded live prices - Silver: £' + state.silverPriceGBP + ', Nisab: £' + state.nisabGBP.toFixed(2));
                    }
                }
            }
        } catch (e) { 
            console.warn('Using fallback prices', e); 
        }

        try {
            const currResponse = await fetch('https://gloucesterprayertimes.com/zakatapp/currencies.php');
            if (currResponse.ok) {
                const currData = await currResponse.json();
                if (currData.result === 'success' && currData.currencies) {
                    state.currencies = Object.entries(currData.currencies).map(([code, name]) => ({
                        code: code,
                        name: name
                    })).sort((a, b) => a.name.localeCompare(b.name));
                    console.log('✅ Loaded ' + state.currencies.length + ' currencies');
                }
            }
        } catch (e) { console.warn('Using fallback currencies'); }

        try {
            const ratesResponse = await fetch('https://gloucesterprayertimes.com/zakatapp/get_rates.php');
            if (ratesResponse.ok) {
                const ratesData = await ratesResponse.json();
                if (ratesData.result === 'success' && ratesData.conversion_rates) {
                    state.exchangeRates = ratesData.conversion_rates;
                    console.log('✅ Loaded exchange rates');
                }
            }
        } catch (e) { console.warn('Using fallback rates'); }

        render();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('app').innerHTML = '<div class="loading"><p style="color: red;">Error loading calculator. Please refresh.</p></div>';
    }
}

// Currency conversion
function convertToGBP(amount, currency) {
    if (currency === 'GBP') return amount;
    const rate = state.exchangeRates[currency] || 1;
    return amount / rate;
}

function convertFromGBP(amountGBP, currency) {
    if (currency === 'GBP') return amountGBP;
    const rate = state.exchangeRates[currency] || 1;
    return amountGBP * rate;
}

function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Calculate totals
function calculateTotals() {
    let assets = 0;
    let liabilities = 0;

    // Gold
    state.goldItems.forEach(item => {
        if (item.inputType === 'weight') {
            const caratMultipliers = { '24K': 1, '22K': 0.916, '21K': 0.875, '18K': 0.75, '14K': 0.583, '9K': 0.375 };
            const multiplier = caratMultipliers[item.carat] || 1;
            const pureGoldGrams = sanitizeNumber(item.weight) * multiplier;
            assets += pureGoldGrams * state.goldPriceGBP;
        } else {
            assets += convertToGBP(sanitizeNumber(item.value), state.selectedCurrency);
        }
    });

    // Silver
    if (state.silverInputMode === 'weight') {
        const silverWeightGrams = sanitizeNumber(state.silverWeight);
        assets += silverWeightGrams * state.silverPriceGBP;
    } else {
        assets += convertToGBP(sanitizeNumber(state.silverValue), state.selectedCurrency);
    }

    // Cash
    assets += convertToGBP(sanitizeNumber(state.cashInHand), state.selectedCurrency);

    // Lists
    const addList = (list, multiplier = 1) => {
        list.forEach(item => {
            assets += convertToGBP(sanitizeNumber(item.amount), state.selectedCurrency) * multiplier;
        });
    };

    addList(state.bankAccounts);
    addList(state.crypto);
    addList(state.digitalWallets);
    addList(state.isas);
    addList(state.stocksAndShares, 0.4);
    addList(state.otherAssets);
    addList(state.receivables);

    if (state.includeBusinessAssets) {
        assets += convertToGBP(sanitizeNumber(state.businessStockValue), state.selectedCurrency);
        assets += convertToGBP(sanitizeNumber(state.businessInvoices), state.selectedCurrency);
        addList(state.businessAccounts);
    }

    if (state.pensionType === 'DC' && state.dcAccess === 'Accessible' && state.includeDCPension) {
        assets += convertToGBP(sanitizeNumber(state.pensionValue), state.selectedCurrency) * 0.4;
    }

    // Liabilities
    liabilities += convertToGBP(sanitizeNumber(state.studentLoans), state.selectedCurrency);
    liabilities += convertToGBP(sanitizeNumber(state.carFinance), state.selectedCurrency);
    liabilities += convertToGBP(sanitizeNumber(state.councilTax), state.selectedCurrency);
    liabilities += convertToGBP(sanitizeNumber(state.mortgageOrRent), state.selectedCurrency);

    const addLiabilityList = (list) => {
        list.forEach(item => {
            liabilities += convertToGBP(sanitizeNumber(item.amount), state.selectedCurrency);
        });
    };

    addLiabilityList(state.creditCards);
    addLiabilityList(state.personalLoans);
    addLiabilityList(state.otherBills);

    if (state.includeBusinessAssets) {
        liabilities += convertToGBP(sanitizeNumber(state.businessTaxes), state.selectedCurrency);
        addLiabilityList(state.businessLoans);
        addLiabilityList(state.overdrafts);
        addLiabilityList(state.invoicesOwed);
    }

    const netAssets = assets - liabilities;
    const isAboveNisab = netAssets > state.nisabGBP;
    let zakatPayable = isAboveNisab ? netAssets * 0.025 : 0;

    if (state.pensionType === 'DC' && state.dcAccess === 'Accessible' && state.includeDCPension) {
        const pensionGBP = convertToGBP(sanitizeNumber(state.pensionValue), state.selectedCurrency);
        const pensionZakat = pensionGBP * 0.01;
        zakatPayable = zakatPayable - (pensionGBP * 0.4 * 0.025) + pensionZakat;
    }

    return { assets, liabilities, netAssets, zakatPayable, isAboveNisab };
}

// Render
function render() {
    const totals = calculateTotals();
    const nisabDisplay = convertFromGBP(state.nisabGBP, state.selectedCurrency);
    
    let html = `
        <div class="header">
            <div class="container">
                <h1>🌙 Zakat Calculator</h1>
                <p>Gloucester Zakat Fund</p>
            </div>
        </div>

        <div class="container">
            <div class="currency-selector">
                <label for="currency">Currency:</label>
                <select id="currency" onchange="changeCurrency(this.value)">
                    ${state.currencies.map(c => `
                        <option value="${sanitizeHTML(c.code)}" ${c.code === state.selectedCurrency ? 'selected' : ''}>
                            ${sanitizeHTML(c.code)} - ${sanitizeHTML(c.name)}
                        </option>
                    `).join('')}
                </select>
            </div>

            <div class="nisab-card">
                <h2>📊 Nisab Threshold</h2>
                <div class="nisab-value">${formatCurrency(nisabDisplay, state.selectedCurrency)}</div>
                <p>Based on 612.36g of silver at ${state.calculationDate}. Updated daily.</p>
            </div>

            <div class="progress-section">
                <div class="step-title">${getStepTitle(state.currentStep)}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(state.currentStep / state.totalSteps) * 100}%"></div>
                </div>
                <div class="step-indicator">Step ${state.currentStep} of ${state.totalSteps}</div>
            </div>

            <div class="content-card">
                ${renderStep(state.currentStep)}
            </div>
        </div>

        <div class="footer">
            <div class="footer-content">
                <div class="totals-grid">
                    <div class="total-item">
                        <div class="total-label">Assets</div>
                        <div class="total-value assets">${formatCurrency(convertFromGBP(totals.assets, state.selectedCurrency), state.selectedCurrency)}</div>
                    </div>
                    <div class="total-item">
                        <div class="total-label">Liabilities</div>
                        <div class="total-value liabilities">${formatCurrency(convertFromGBP(totals.liabilities, state.selectedCurrency), state.selectedCurrency)}</div>
                    </div>
                    <div class="total-item">
                        <div class="total-label">Net Assets</div>
                        <div class="total-value">${formatCurrency(convertFromGBP(totals.netAssets, state.selectedCurrency), state.selectedCurrency)}</div>
                    </div>
                </div>

                <div class="zakat-result">
                    <span class="zakat-label">${totals.isAboveNisab ? '✓ Above Nisab - Zakat Due:' : '✗ Below Nisab'}</span>
                    <span class="zakat-amount">${formatCurrency(convertFromGBP(totals.zakatPayable, state.selectedCurrency), state.selectedCurrency)}</span>
                </div>

                <div class="navigation-buttons">
                    ${state.currentStep > 1 ? '<button class="btn btn-previous" onclick="previousStep()">⬅ Previous</button>' : ''}
                    ${state.currentStep < state.totalSteps ? '<button class="btn btn-next" onclick="nextStep()">Next ➡</button>' : ''}
                </div>
            </div>
        </div>
    `;

    document.getElementById('app').innerHTML = html;
    
    createGoldModal();
    
    // ✅ FIX: Initialize payment buttons on summary page
    if (state.currentStep === 7) {
        setTimeout(() => {
            updatePaymentButtonsVisibility();
            setDonationType(selectedDonationType);
        }, 100);
    }
}

function createGoldModal() {
    if (document.getElementById('goldModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'goldModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Add Gold Item</h2>
                <button class="modal-close" onclick="closeGoldModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Item Name</label>
                    <input type="text" id="goldItemName" class="form-input" placeholder="e.g., Wedding ring, Necklace" maxlength="100">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Input Method</label>
                    <div class="segmented-control">
                        <button type="button" id="goldWeightBtn" class="active" onclick="setGoldInputType('weight')">By Weight</button>
                        <button type="button" id="goldValueBtn" onclick="setGoldInputType('value')">By Value</button>
                    </div>
                </div>
                
                <div id="goldWeightInputs">
                    <div class="form-group">
                        <label class="form-label">Weight (grams)</label>
                        <input type="number" id="goldWeight" class="form-input" placeholder="Enter weight in grams" step="0.01" min="0" max="100000">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Carat / Purity</label>
                        <select id="goldCarat" class="form-input">
                            <option value="24K">24 Carat (99.9% pure)</option>
                            <option value="22K">22 Carat (91.6% pure)</option>
                            <option value="21K">21 Carat (87.5% pure)</option>
                            <option value="18K" selected>18 Carat (75% pure)</option>
                            <option value="14K">14 Carat (58.3% pure)</option>
                            <option value="9K">9 Carat (37.5% pure)</option>
                        </select>
                        <div class="help-text">Most jewellery in the UK is 18 carat or 9 carat</div>
                    </div>
                </div>
                
                <div id="goldValueInputs" style="display: none;">
                    <div class="form-group">
                        <label class="form-label">Current Market Value</label>
                        <input type="number" id="goldValue" class="form-input" placeholder="Enter current value" step="0.01" min="0" max="10000000">
                        <div class="help-text">Enter the total current market value in ${state.selectedCurrency}</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-modal btn-modal-cancel" type="button" onclick="closeGoldModal()">Cancel</button>
                <button class="btn-modal btn-modal-save" type="button" onclick="saveGoldItem()">Save Item</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeGoldModal();
        }
    });
}

function getStepTitle(step) {
    const titles = {
        1: 'Gold & Silver',
        2: 'Cash & Investments',
        3: 'Business Assets',
        4: 'Money Owed to You',
        5: 'Pension',
        6: 'Debts & Liabilities',
        7: 'Zakat Summary'
    };
    return titles[step];
}

function renderStep(step) {
    switch(step) {
        case 1: return renderGoldSilverStep();
        case 2: return renderLiquidAssetsStep();
        case 3: return renderBusinessStep();
        case 4: return renderReceivablesStep();
        case 5: return renderPensionStep();
        case 6: return renderLiabilitiesStep();
        case 7: return renderSummaryStep();
        default: return '';
    }
}

function renderGoldSilverStep() {
    return `
        <div class="form-group">
            <label class="form-label">📅 Valuation Date</label>
            <input type="date" class="form-input" value="${state.calculationDate}" 
                onchange="state.calculationDate = this.value; render();" max="${new Date().toISOString().split('T')[0]}">
            <div class="help-text">This is your Zakat 'snapshot' date. All asset values must be from this date.</div>
        </div>

        <div class="info-box">
            🪙 <strong>All gold and silver is zakatable</strong> according to the Hanafi school, including all jewellery worn for personal use.<br><br>
            <strong>INCLUDE THE FULL VALUE:</strong> You must include the total market value of all the gold and silver you owned on your calculation date. Use the gold/silver price from your selected zakat date.
        </div>

        <div class="form-group">
            <label class="form-label">🥇 Gold Items</label>
            ${state.goldItems.map((item, idx) => `
                <div class="gold-item-card">
                    <div class="gold-item-header">
                        <span class="gold-item-name">${sanitizeHTML(item.name || 'Unnamed item')}</span>
                        <div class="gold-item-actions">
                            <button onclick="editGoldItem(${idx})">✏️</button>
                            <button onclick="removeGoldItem(${idx})">🗑️</button>
                        </div>
                    </div>
                    <div class="gold-item-details">
                        ${item.inputType === 'weight' 
                            ? `Weight: ${sanitizeNumber(item.weight)}g (${sanitizeHTML(item.carat)})`
                            : `Value: ${formatCurrency(convertFromGBP(sanitizeNumber(item.valueGBP), state.selectedCurrency), state.selectedCurrency)}`
                        }
                    </div>
                </div>
            `).join('')}
            <button class="btn-add" onclick="addGoldItem()">+ Add Gold Item</button>
        </div>

        <div class="form-group">
            <label class="form-label">🥈 Silver</label>
            <div class="segmented-control">
                <button class="${state.silverInputMode === 'weight' ? 'active' : ''}" onclick="setSilverMode('weight')">By Weight</button>
                <button class="${state.silverInputMode === 'value' ? 'active' : ''}" onclick="setSilverMode('value')">By Value</button>
            </div>
            ${state.silverInputMode === 'weight' ? `
                <input type="number" class="form-input" placeholder="Weight in grams" min="0" max="100000" step="0.01"
                    value="${state.silverWeight}" oninput="state.silverWeight = this.value; updateFooter();">
                ${state.silverWeight ? `<div class="help-text">Value: ${formatCurrency(convertFromGBP(sanitizeNumber(state.silverWeight) * state.silverPriceGBP, state.selectedCurrency), state.selectedCurrency)}</div>` : ''}
            ` : `
                <input type="number" class="form-input" placeholder="Current market value" min="0" max="10000000" step="0.01"
                    value="${state.silverValue}" oninput="state.silverValue = this.value; updateFooter();">
            `}
        </div>
    `;
}

function renderLiquidAssetsStep() {
    return `
        <p class="section-description">Enter your cash holdings, bank accounts, and investment portfolios.</p>
        
        <div class="info-box compact">
            💰 Include all cash you own: money at home, in bank accounts, and digital wallets (e.g. PayPal, Revolut). Current and savings accounts are both zakatable.
        </div>

        <div class="form-group">
            <label class="form-label">Cash in Hand</label>
            <input type="number" class="form-input" placeholder="Physical cash you own" min="0" max="10000000" step="0.01"
                value="${state.cashInHand}" oninput="state.cashInHand = this.value; updateFooter();">
        </div>

        ${renderDynamicList('Bank Accounts', 'bankAccounts', 'Account name')}
        ${renderDynamicList('Digital Wallets', 'digitalWallets', 'Wallet name')}
        ${renderDynamicList('Cryptocurrency', 'crypto', 'Crypto name')}
        ${renderDynamicList('ISAs', 'isas', 'ISA name')}
        
        <div class="form-group">
            <label class="form-label">Stocks & Shares</label>
            <div class="help-text" style="margin-bottom: 15px;">Enter the current market value. Zakat will be calculated on 40% of this amount (roughly 1% of total share value).</div>
            
            <div style="background: linear-gradient(135deg, #E8F5E9 0%, #C5E1A5 100%); padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #7CB342;">
                <h3 style="color: #33691E; margin-bottom: 15px; font-size: 18px;">📊 Quick Add Stock</h3>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-weight: 600; color: #33691E; margin-bottom: 8px; font-size: 14px;">Stock Name (optional)</label>
                    <input type="text" id="quickStockName" class="form-input" placeholder="e.g., Portfolio, ISA, General Stocks" maxlength="100">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-weight: 600; color: #33691E; margin-bottom: 8px; font-size: 14px;">Total Portfolio Value</label>
                    <input type="number" id="quickStockValue" class="form-input" placeholder="Enter total value" min="0" max="100000000" step="0.01"
                        style="font-size: 18px; font-weight: 700;"
                        oninput="updateQuickStockCalculator(this.value)">
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="color: #666; font-size: 14px;">Zakatable Amount (40%):</span>
                        <span id="quickZakatableAmount" style="color: #7CB342; font-weight: 700; font-size: 16px;">—</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 2px solid #E8F5E9;">
                        <span style="color: #33691E; font-weight: 700; font-size: 15px;">Zakat Due (2.5%):</span>
                        <span id="quickZakatDue" style="color: #558B2F; font-weight: 900; font-size: 18px;">—</span>
                    </div>
                </div>
                
                <button onclick="addQuickStock()" class="btn-add" style="background: linear-gradient(135deg, #7CB342 0%, #558B2F 100%); color: white; border: none; margin-top: 10px;">
                    ➕ Add to Stocks & Shares
                </button>
                
                <div style="font-size: 12px; color: #558B2F; font-style: italic; text-align: center; margin-top: 10px;">
                    This works out to approximately 1% of your total portfolio value
                </div>
            </div>
            
            ${state.stocksAndShares.map((item, idx) => `
                <div class="list-item">
                    <input type="text" class="form-input" placeholder="Stock name" maxlength="100"
                        value="${sanitizeHTML(item.name)}" oninput="updateListItemLive('stocksAndShares', ${idx}, 'name', this.value)">
                    <input type="number" class="form-input" placeholder="Amount" min="0" max="100000000" step="0.01"
                        value="${item.amount}" oninput="updateListItemLive('stocksAndShares', ${idx}, 'amount', this.value)">
                    <button class="btn-remove" onclick="removeListItem('stocksAndShares', ${idx})">✕</button>
                </div>
            `).join('')}
            ${state.stocksAndShares.length === 0 ? '<p style="color: #999; font-style: italic; margin: 10px 0;">No stocks added yet. Use the calculator above to add your portfolio.</p>' : ''}
        </div>
        
        ${renderDynamicList('Other Assets', 'otherAssets', 'Asset name', 'Include any other zakatable assets not listed (e.g., trust funds, other investments).')}
    `;
}

function renderBusinessStep() {
    return `
        <p class="section-description">Toggle on if you are self-employed, run a business, or own goods bought for resale.</p>

        <div class="form-group">
            <label class="checkbox-group">
                <input type="checkbox" ${state.includeBusinessAssets ? 'checked' : ''} 
                    onchange="state.includeBusinessAssets = this.checked; render();">
                <span>I have business assets to include</span>
            </label>
        </div>

        ${state.includeBusinessAssets ? `
            <div class="info-box compact">
                💼 If you own a business, zakat is due on:<br>
                • Goods or stock bought with the intention to sell<br>
                • Raw materials used to produce items for sale<br>
                • Cash in hand or in the bank<br>
                • Receivables (money owed to the business)
            </div>

            <div class="form-group">
                <label class="form-label">Business Stock Value</label>
                <input type="number" class="form-input" placeholder="Value of inventory/stock" min="0" max="100000000" step="0.01"
                    value="${state.businessStockValue}" oninput="state.businessStockValue = this.value; updateFooter();">
            </div>

            <div class="form-group">
                <label class="form-label">Business Invoices</label>
                <input type="number" class="form-input" placeholder="Unpaid invoices due to you" min="0" max="100000000" step="0.01"
                    value="${state.businessInvoices}" oninput="state.businessInvoices = this.value; updateFooter();">
            </div>

            ${renderDynamicList('Business Bank Accounts', 'businessAccounts', 'Account name')}
        ` : '<p style="color: #999; font-style: italic;">Business assets are not included in your calculation.</p>'}
    `;
}

function renderReceivablesStep() {
    return `
        <div class="info-box">
            💵 <strong>Strong debts</strong> (likely to be repaid): Fully zakatable (e.g. personal loans, trade debts).<br><br>
            <strong>Weak debts</strong> (uncertain repayment): Zakat is only due once repayment is received, then pay one year's zakat on it.
        </div>

        ${renderDynamicList('Receivables (Money owed to you)', 'receivables', 'Description', 'Include money people owe you that you expect to receive back.')}
    `;
}

function renderPensionStep() {
    return `
        <div class="info-box">
            💼 <strong>Pension Zakat - Important Information</strong><br><br>
            Pension Zakat rules depend on the type of pension and whether you can access it. Most scholars agree that accessible pensions are zakatable, but the method differs from other assets.
        </div>

        <div class="form-group">
            <label class="form-label">Do you have a pension?</label>
            <select class="form-input" onchange="state.pensionType = this.value; render();">
                <option value="NotSure" ${state.pensionType === 'NotSure' ? 'selected' : ''}>Not Sure / Don't Know</option>
                <option value="None" ${state.pensionType === 'None' ? 'selected' : ''}>No Pension</option>
                <option value="DB" ${state.pensionType === 'DB' ? 'selected' : ''}>Defined Benefit (DB) - Final Salary</option>
                <option value="DC" ${state.pensionType === 'DC' ? 'selected' : ''}>Defined Contribution (DC) - Pension Pot</option>
            </select>
            <div class="help-text">
                <strong>DB (Defined Benefit):</strong> You get a guaranteed income when you retire (e.g., final salary, public sector pensions).<br>
                <strong>DC (Defined Contribution):</strong> You have a pension pot that grows based on contributions and investments (e.g., workplace pension, SIPP, personal pension).
            </div>
        </div>

        ${state.pensionType === 'None' ? `
            <p style="color: #999; font-style: italic; padding: 20px; text-align: center;">
                No pension to include in calculation.
            </p>
        ` : ''}

        ${state.pensionType === 'NotSure' ? `
            <div class="info-box">
                ℹ️ <strong>How to check your pension type:</strong><br><br>
                • Check your pension statements or contact your pension provider<br>
                • <strong>Workplace pensions</strong> are usually Defined Contribution (DC)<br>
                • <strong>Public sector pensions</strong> (NHS, teachers, civil service) are usually Defined Benefit (DB)<br>
                • <strong>Final salary schemes</strong> are Defined Benefit (DB)<br>
                • <strong>SIPP or Personal Pensions</strong> are Defined Contribution (DC)
            </div>
        ` : ''}

        ${state.pensionType === 'DB' ? `
            <div class="info-box">
                ✅ <strong>Defined Benefit (DB) Pensions - No Zakat Due</strong><br><br>
                DB pensions (final salary schemes) are <strong>not zakatable</strong> according to most scholars because:<br>
                • You don't own the pension pot<br>
                • You only receive income when you retire<br>
                • The money is not accessible or in your possession<br>
                • It's a future promise, not current wealth<br><br>
                <strong>Zakat is only due on the income you receive after retirement</strong> - treat it like regular income and include any savings from it in your annual Zakat calculation.
            </div>
            <p style="color: #7CB342; font-weight: 600; padding: 20px; text-align: center; background: #E8F5E9; border-radius: 8px; margin-top: 15px;">
                ✓ No Zakat due on your DB pension at this time
            </p>
        ` : ''}

        ${state.pensionType === 'DC' ? `
            <div class="info-box">
                💰 <strong>Defined Contribution (DC) Pensions</strong><br><br>
                DC pensions have a pot of money that belongs to you. The Zakat ruling depends on whether you can access this money.
            </div>

            <div class="form-group">
                <label class="form-label">Can you access your pension pot?</label>
                <select class="form-input" onchange="state.dcAccess = this.value; render();">
                    <option value="Locked" ${state.dcAccess === 'Locked' ? 'selected' : ''}>🔒 Locked - Cannot access yet (under pension age)</option>
                    <option value="Accessible" ${state.dcAccess === 'Accessible' ? 'selected' : ''}>🔓 Accessible - Can withdraw now (over 55/57)</option>
                </select>
                <div class="help-text">
                    In the UK, you can usually access your pension from age 55 (rising to 57 from 2028).
                </div>
            </div>

            ${state.dcAccess === 'Locked' ? `
                <div class="info-box">
                    🔒 <strong>Locked DC Pension - No Zakat Due</strong><br><br>
                    Your pension is locked and cannot be accessed yet, so <strong>no Zakat is due</strong> on it at this time according to most scholars.<br><br>
                    <strong>Once you can access it</strong> (usually age 55+), you should reassess and may need to pay Zakat on it.
                </div>
                <p style="color: #7CB342; font-weight: 600; padding: 20px; text-align: center; background: #E8F5E9; border-radius: 8px; margin-top: 15px;">
                    ✓ No Zakat due on your locked pension at this time
                </p>
            ` : ''}

            ${state.dcAccess === 'Accessible' ? `
                <div class="info-box">
                    🔓 <strong>Accessible DC Pension - Zakat May Be Due</strong><br><br>
                    Since you can access your pension pot, many scholars say Zakat is due on it. However, the method differs:<br><br>
                    <strong>Special Pension Zakat Rate: 1% per year</strong><br>
                    • Instead of the normal 2.5% rate<br>
                    • This accounts for the 40% zakatable portion and 2.5% rate (40% × 2.5% ≈ 1%)<br>
                    • This is the Hanafi method for pension Zakat<br><br>
                    <strong>Why 1%?</strong><br>
                    Pensions are invested portfolios. Like stocks and shares, only about 40% is considered zakatable assets (the rest is property, equipment, etc.). So: 40% × 2.5% = 1%
                </div>

                <div class="form-group">
                    <label class="checkbox-group">
                        <input type="checkbox" ${state.includeDCPension ? 'checked' : ''} 
                            onchange="state.includeDCPension = this.checked; render();">
                        <span>Yes, include my accessible DC pension in Zakat calculation</span>
                    </label>
                </div>

                ${state.includeDCPension ? `
                    <div class="form-group">
                        <label class="form-label">Current Pension Pot Value</label>
                        <input type="number" class="form-input" placeholder="Enter total pension pot value" min="0" max="100000000" step="0.01"
                            value="${state.pensionValue}" oninput="state.pensionValue = this.value; updateFooter();">
                        <div class="help-text">
                            Check your latest pension statement for the current value. Include all accessible DC pension pots.
                        </div>
                        ${state.pensionValue ? `
                            <div style="background: #E8F5E9; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #7CB342;">
                                <strong style="color: #33691E;">Pension Zakat Calculation:</strong><br>
                                Pension Value: ${formatCurrency(convertFromGBP(sanitizeNumber(state.pensionValue), state.selectedCurrency), state.selectedCurrency)}<br>
                                Zakatable Amount (40%): ${formatCurrency(convertFromGBP(sanitizeNumber(state.pensionValue) * 0.4, state.selectedCurrency), state.selectedCurrency)}<br>
                                <strong style="color: #558B2F; font-size: 18px;">Pension Zakat Due (1%): ${formatCurrency(convertFromGBP(sanitizeNumber(state.pensionValue) * 0.01, state.selectedCurrency), state.selectedCurrency)}</strong>
                            </div>
                        ` : ''}
                    </div>
                ` : `
                    <p style="color: #999; font-style: italic; padding: 20px; text-align: center;">
                        Pension not included in calculation. Tick the box above to include it.
                    </p>
                `}
            ` : ''}
        ` : ''}

        <div class="info-box" style="margin-top: 25px;">
            <strong>⚠️ Important Notes:</strong><br>
            • Pension Zakat rulings can vary between scholars - please consult a qualified scholar for your specific situation<br>
            • This calculator follows the Hanafi method<br>
            • Some scholars may have different views on pension Zakat<br>
            • If in doubt, consult with Gloucester Zakat Fund or your local Imam
        </div>
    `;
}

function renderLiabilitiesStep() {
    return `
        <p class="section-description">Enter your current debts and immediate liabilities.</p>

        <div class="info-box compact">
            ℹ️ Deduct up to 12 months worth of repayments for long-term debts such as student loans, car finance, or personal loans.
        </div>

        <div class="form-group">
            <label class="form-label">Student Loans (12 months)</label>
            <input type="number" class="form-input" placeholder="Outstanding balance" min="0" max="1000000" step="0.01"
                value="${state.studentLoans}" oninput="state.studentLoans = this.value; updateFooter();">
        </div>

        <div class="form-group">
            <label class="form-label">Car Finance (12 months)</label>
            <input type="number" class="form-input" placeholder="Outstanding balance" min="0" max="1000000" step="0.01"
                value="${state.carFinance}" oninput="state.carFinance = this.value; updateFooter();">
        </div>

        <div class="form-group">
            <label class="form-label">Council Tax</label>
            <input type="number" class="form-input" placeholder="Amount owed" min="0" max="100000" step="0.01"
                value="${state.councilTax}" oninput="state.councilTax = this.value; updateFooter();">
        </div>

        <div class="form-group">
            <label class="form-label">Mortgage/Rent (12 months capital only)</label>
            <input type="number" class="form-input" placeholder="Amount owed" min="0" max="10000000" step="0.01"
                value="${state.mortgageOrRent}" oninput="state.mortgageOrRent = this.value; updateFooter();">
            <div class="help-text">IMPORTANT: Exclude interest from mortgage payments! Only include the principal amount (capital repayment).</div>
        </div>

        ${renderDynamicList('Credit Cards', 'creditCards', 'Card name', 'Deduct any outstanding balance you currently owe (not the full credit limit).')}
        ${renderDynamicList('Personal Loans', 'personalLoans', 'Loan name')}
        ${renderDynamicList('Other Bills', 'otherBills', 'Bill description')}

        ${state.includeBusinessAssets ? `
            <div class="form-group">
                <label class="form-label">Business Taxes Owed</label>
                <input type="number" class="form-input" placeholder="Tax owed" min="0" max="10000000" step="0.01"
                    value="${state.businessTaxes}" oninput="state.businessTaxes = this.value; updateFooter();">
            </div>

            ${renderDynamicList('Business Loans', 'businessLoans', 'Loan name')}
            ${renderDynamicList('Overdrafts', 'overdrafts', 'Account name')}
            ${renderDynamicList('Invoices You Owe', 'invoicesOwed', 'Invoice description')}
        ` : ''}
    `;
}

function renderSummaryStep() {
    const totals = calculateTotals();
    const currentDate = new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
    
    return `
        <div class="summary-card">
            <div class="summary-icon">${totals.isAboveNisab ? '✓' : '✗'}</div>
            <div class="summary-title">${totals.isAboveNisab ? 'Zakat is Due' : 'Below Nisab'}</div>
            <div class="summary-subtitle">
                ${totals.isAboveNisab 
                    ? 'Your wealth exceeds the nisab threshold' 
                    : 'Your wealth is below the nisab threshold - no Zakat due at this time'}
            </div>
        </div>

        <div class="summary-details" id="printable-summary">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #33691E; margin-bottom: 5px;">Zakat Calculation Summary</h2>
                <p style="color: #718072; font-size: 14px;">Date: ${currentDate}</p>
                <p style="color: #718072; font-size: 14px;">Currency: ${state.selectedCurrency}</p>
            </div>

            <div class="summary-row">
                <span class="summary-row-label">Total Assets:</span>
                <span class="summary-row-value" style="color: #7CB342;">${formatCurrency(convertFromGBP(totals.assets, state.selectedCurrency), state.selectedCurrency)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-row-label">Total Liabilities:</span>
                <span class="summary-row-value" style="color: #8D6E63;">${formatCurrency(convertFromGBP(totals.liabilities, state.selectedCurrency), state.selectedCurrency)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-row-label">Net Assets:</span>
                <span class="summary-row-value">${formatCurrency(convertFromGBP(totals.netAssets, state.selectedCurrency), state.selectedCurrency)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-row-label">Nisab Threshold:</span>
                <span class="summary-row-value" style="color: #FFD54F;">${formatCurrency(convertFromGBP(state.nisabGBP, state.selectedCurrency), state.selectedCurrency)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-row-label" style="font-size: 20px;">Zakat Due (2.5%):</span>
                <span class="final-zakat">${formatCurrency(convertFromGBP(totals.zakatPayable, state.selectedCurrency), state.selectedCurrency)}</span>
            </div>
        </div>

        ${totals.isAboveNisab && totals.zakatPayable > 0 ? `
            <div class="donation-section" style="margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #7CB342 0%, #558B2F 100%); padding: 30px; border-radius: 20px; margin-bottom: 25px; text-align: center; color: white;">
                    <h3 style="font-size: 28px; margin-bottom: 10px; font-weight: 900;">💚 Pay Your Zakat Now</h3>
                    <p style="opacity: 0.95; font-size: 15px;">Fulfill your obligation with Gloucester Zakat Fund</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #E8F5E9 0%, #C5E1A5 100%); padding: 30px; border-radius: 16px; margin-bottom: 25px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 16px; color: #558B2F; margin-bottom: 8px; font-weight: 700;">Your Zakat Payment:</div>
                        <div style="font-size: 48px; font-weight: 900; color: #33691E; margin-bottom: 15px;">
                            ${formatCurrency(convertFromGBP(totals.zakatPayable, state.selectedCurrency), state.selectedCurrency)}
                        </div>
                    </div>
                    
                    <h4 style="color: #33691E; font-size: 18px; margin-bottom: 20px; text-align: center; font-weight: 700;">Choose Payment Method:</h4>
                    
                    <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 15px; border: 2px solid #7CB342;">
                        <h5 style="color: #33691E; margin-bottom: 10px; font-size: 16px;">💳 Pay with PayPal</h5>
                        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Secure payment via PayPal - Accepts all major cards</p>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; color: #33691E; font-weight: 600; margin-bottom: 10px; font-size: 14px;">Donation Type:</label>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                <button onclick="setDonationType('zakat')" id="zakat-type-btn" style="padding: 12px; background: #7CB342; color: white; border: 2px solid #7CB342; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 12px;">
                                    Zakat / Wājib Sadaqah
                                </button>
                                <button onclick="setDonationType('sadaqah-lillah')" id="sadaqah-lillah-type-btn" style="padding: 12px; background: white; color: #7CB342; border: 2px solid #7CB342; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 12px;">
                                    Ṣadaqah Lillāh
                                </button>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 15px;" id="payment-amount-section">
                            <label style="display: block; color: #33691E; font-weight: 600; margin-bottom: 10px; font-size: 14px;">Payment Amount:</label>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                <button onclick="setPaymentAmount('full')" id="full-amount-btn" style="padding: 12px; background: #7CB342; color: white; border: 2px solid #7CB342; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;">
                                    Full Amount
                                </button>
                                <button onclick="setPaymentAmount('partial')" id="partial-amount-btn" style="padding: 12px; background: white; color: #7CB342; border: 2px solid #7CB342; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;">
                                    Custom Amount
                                </button>
                            </div>
                            
                            <div id="partial-amount-input" style="display: none; margin-top: 10px;">
                                <input type="number" id="custom-amount" placeholder="Enter amount" min="1" step="0.01" max="10000000"
                                    style="width: 100%; padding: 12px; border: 2px solid #7CB342; border-radius: 8px; font-size: 16px; font-weight: 700;"
                                    value="${convertFromGBP(totals.zakatPayable, state.selectedCurrency).toFixed(2)}"
                                    oninput="updatePayPalButtonAmount()">
                                <p style="color: #999; font-size: 12px; margin-top: 8px; font-style: italic;">Enter any amount you wish to donate</p>
                            </div>
                        </div>
                        
                        <div style="background: #F0F8FF; padding: 15px; border-radius: 8px; border: 2px solid #4A90E2; margin-bottom: 20px;">
                            <label style="display: flex; align-items: start; cursor: pointer; gap: 10px;">
                                <input type="checkbox" id="giftaid-checkbox" style="margin-top: 4px; width: 20px; height: 20px; cursor: pointer; accent-color: #4A90E2;">
                                <div>
                                    <strong style="color: #1E3A8A; font-size: 14px; display: block; margin-bottom: 5px;">Add Gift Aid (UK taxpayers only)</strong>
                                    <span style="color: #4A5568; font-size: 12px; line-height: 1.5;">
                                        Boost your donation by 25p for every £1 at no cost to you. 
                                        I am a UK taxpayer and understand that if I pay less Income Tax and/or Capital Gains Tax than the amount of Gift Aid claimed on all my donations in that tax year it is my responsibility to pay any difference.
                                    </span>
                                </div>
                            </label>
                        </div>

                        <div style="text-align: center; margin-bottom: 15px; padding: 15px; background: #F9FBF9; border-radius: 8px;">
                            <div style="color: #558B2F; font-size: 14px; margin-bottom: 5px; font-weight: 600;">You're donating:</div>
                            <div id="display-amount" style="font-size: 32px; font-weight: 900; color: #33691E;">
                                ${formatCurrency(convertFromGBP(totals.zakatPayable, state.selectedCurrency), state.selectedCurrency)}
                            </div>
                        </div>

                        <div id="payment-options-container" style="display: block; margin-bottom: 15px;">
                            <div id="no-fees-payment-option" style="background: white; padding: 25px; border-radius: 12px; border: 4px solid #7CB342; text-align: center; display: block; margin-bottom: 15px;">
                                <div style="font-size: 40px; margin-bottom: 10px;">💚</div>
                                <div style="color: #33691E; font-weight: 900; font-size: 20px; margin-bottom: 12px;">No Fees</div>
                                
                                <div style="color: #666; font-size: 14px; margin-bottom: 15px; line-height: 1.6;">
                                    <strong style="color: #33691E;">£100 = £100 to charity</strong><br>
                                    <span style="font-size: 12px;">Every penny goes to those in need</span>
                                </div>
                                
                                <div style="text-align: left; margin-bottom: 12px; padding: 12px; background: #F0F8E6; border-radius: 8px;">
                                    <div style="color: #558B2F; font-size: 13px; font-weight: 600; margin-bottom: 6px;">✅ Benefits:</div>
                                    <div style="color: #666; font-size: 12px; line-height: 1.5;">
                                        • 100% of your money goes to charity<br>
                                        • Zero fees deducted<br>
                                        • Perfect for maximizing impact
                                    </div>
                                </div>
                                
                                <div style="text-align: left; margin-bottom: 15px; padding: 12px; background: #FFF9E6; border-radius: 8px;">
                                    <div style="color: #856404; font-size: 13px; font-weight: 600; margin-bottom: 6px;">📝 Just note:</div>
                                    <div style="color: #666; font-size: 12px; line-height: 1.5;">
                                        • You'll need to enter the amount on PayPal<br>
                                        • Gift Aid form emailed after donation (quick to complete)
                                    </div>
                                </div>
                                
                                <button onclick="openPayPalGivingFund()" style="width: 100%; background: #7CB342; color: white; padding: 16px; border: none; border-radius: 8px; font-weight: 700; font-size: 16px; cursor: pointer;">
                                    Choose This
                                </button>
                            </div>
                            
                            <div id="quick-easy-payment-option" style="background: white; padding: 25px; border-radius: 12px; border: 4px solid #0070BA; text-align: center; display: none;">
                                <div style="font-size: 40px; margin-bottom: 10px;">⚡</div>
                                <div style="color: #0070BA; font-weight: 900; font-size: 20px; margin-bottom: 12px;">Quick &amp; Easy</div>
                                
                                <div style="color: #666; font-size: 14px; margin-bottom: 15px; line-height: 1.6;">
                                    <strong style="color: #0070BA;">£100 = £98 to charity</strong><br>
                                    <span style="font-size: 12px;">Small fee, but super convenient</span>
                                </div>
                                
                                <div style="text-align: left; margin-bottom: 12px; padding: 12px; background: #E8F4F8; border-radius: 8px;">
                                    <div style="color: #0070BA; font-size: 13px; font-weight: 600; margin-bottom: 6px;">✅ Benefits:</div>
                                    <div style="color: #666; font-size: 12px; line-height: 1.5;">
                                        • Amount pre-filled - just click Pay!<br>
                                        • Gift Aid handled automatically<br>
                                        • Fastest way to donate
                                    </div>
                                </div>
                                
                                <div style="text-align: left; margin-bottom: 15px; padding: 12px; background: #FFF9E6; border-radius: 8px;">
                                    <div style="color: #856404; font-size: 13px; font-weight: 600; margin-bottom: 6px;">💰 Small cost:</div>
                                    <div style="color: #666; font-size: 12px; line-height: 1.5;">
                                        • ~£2 fee per £100 (standard PayPal fee)<br>
                                        • Worth it if you value speed &amp; convenience
                                    </div>
                                </div>
                                
                                <button onclick="openPayPalStandard()" style="width: 100%; background: #0070BA; color: white; padding: 16px; border: none; border-radius: 8px; font-weight: 700; font-size: 16px; cursor: pointer;">
                                    Choose This
                                </button>
                            </div>
                        </div>

                        <div style="background: #F0F8FF; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; border: 2px solid #4A90E2;">
                            <p style="color: #1E3A8A; font-size: 14px; margin: 0; line-height: 1.6;">
                                <strong>💡 Both options support Gift Aid!</strong><br>
                                Choose based on what matters more to you: <strong>maximum impact</strong> (No Fees) or <strong>maximum convenience</strong> (Quick &amp; Easy)
                            </p>
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 15px; border: 2px solid #7CB342;">
                        <h5 style="color: #33691E; margin-bottom: 10px; font-size: 16px;">🏦 Bank Transfer (UK)</h5>
                        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Transfer directly to our bank account</p>
                        <button onclick="showBankDetails()" style="width: 100%; background: linear-gradient(135deg, #7CB342 0%, #558B2F 100%); color: white; padding: 14px; border: none; border-radius: 8px; font-weight: 700; font-size: 16px; cursor: pointer;">
                            📋 Show Bank Details
                        </button>
                        
                        <div id="bank-details" style="display: none; margin-top: 15px; padding: 20px; background: #F9FBF9; border-radius: 8px; border-left: 4px solid #7CB342;">
                            <p style="color: #33691E; font-weight: 700; margin-bottom: 15px; font-size: 16px;">Bank Transfer Details:</p>
                            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                                <p style="color: #666; font-size: 14px; margin: 8px 0;"><strong>Account Name:</strong> Gloucester Zakat Fund</p>
                                <p style="color: #666; font-size: 14px; margin: 8px 0;"><strong>Sort Code:</strong> <span style="font-family: monospace; background: #E8F5E9; padding: 4px 8px; border-radius: 4px;">40-22-09</span></p>
                                <p style="color: #666; font-size: 14px; margin: 8px 0;"><strong>Account Number:</strong> <span style="font-family: monospace; background: #E8F5E9; padding: 4px 8px; border-radius: 4px;">32684810</span></p>
                            </div>
                            <div style="background: #FFF9E6; padding: 15px; border-radius: 8px; border: 2px solid #FFD54F; margin-bottom: 10px;">
                                <p style="color: #666; font-size: 14px; margin: 8px 0;"><strong>Full Zakat Amount:</strong> <span style="font-weight: 700; color: #7CB342; font-size: 16px;">${formatCurrency(convertFromGBP(totals.zakatPayable, state.selectedCurrency), state.selectedCurrency)}</span></p>
                                <p style="color: #666; font-size: 14px; margin: 8px 0;"><strong>Your Unique Reference:</strong></p>
                                <p id="bank-reference-display" style="font-family: monospace; background: white; padding: 12px; border-radius: 4px; font-weight: 700; font-size: 16px; margin: 5px 0; text-align: center; letter-spacing: 1px; border: 2px dashed #7CB342;">
                                    ${generateBankReference('zakat')}
                                </p>
                                <p style="color: #856404; font-size: 12px; margin-top: 8px; font-style: italic;">
                                    ⚠️ Please use this exact reference when making your transfer - it helps us track and process your donation correctly.
                                </p>
                            </div>
                            <div style="background: #F0F8FF; padding: 12px; border-radius: 8px; border: 2px solid #4A90E2; margin-bottom: 10px;">
                                <p style="color: #1E3A8A; font-size: 13px; font-weight: 600; margin-bottom: 5px;">📝 Gift Aid (UK taxpayers):</p>
                                <p style="color: #4A5568; font-size: 12px; line-height: 1.5;">
                                    After making your transfer, email <a href="mailto:gloucesterzf@gmail.com" style="color: #0070BA; font-weight: 600;">gloucesterzf@gmail.com</a> with your name and address to claim Gift Aid on your donation.
                                </p>
                            </div>
                            <p style="color: #999; font-size: 12px; margin-top: 12px; text-align: center; font-style: italic;">You can transfer any amount - partial payments are welcome</p>
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #7CB342;">
                        <h5 style="color: #33691E; margin-bottom: 10px; font-size: 16px;">📧 Need Help?</h5>
                        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Questions about payment or prefer another method?</p>
                        <a href="mailto:gloucesterzf@gmail.com" 
                           style="display: block; background: #E8F5E9; color: #558B2F; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; text-align: center; border: 2px solid #7CB342;">
                            📨 Email: gloucesterzf@gmail.com
                        </a>
                    </div>
                    
                    <p style="text-align: center; color: #558B2F; font-size: 13px; margin-top: 20px; font-style: italic;">
                        🤲 All payments go directly to Gloucester Zakat Fund to help those in need
                    </p>
                </div>
            </div>
        ` : `
            <div style="margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #E8F5E9 0%, #C5E1A5 100%); padding: 30px; border-radius: 20px; margin-bottom: 25px; text-align: center; border: 3px solid #7CB342;">
                    <div style="font-size: 48px; margin-bottom: 15px;">🤲</div>
                    <h3 style="font-size: 24px; margin-bottom: 10px; font-weight: 900; color: #33691E;">No Zakat Due</h3>
                    <p style="font-size: 16px; color: #558B2F; margin-bottom: 20px;">Your wealth is below the Nisab threshold</p>
                    <p style="opacity: 0.95; font-size: 15px; color: #666;">But you can still give voluntary charity (Sadaqah/Lillah) to earn immense reward! 🌟</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <h4 style="color: #33691E; font-size: 20px; margin-bottom: 20px; text-align: center; font-weight: 700;">💚 Give Voluntary Charity (Lillah)</h4>
                    
                    <p style="color: #666; font-size: 14px; text-align: center; margin-bottom: 25px; line-height: 1.6;">
                        "The example of those who spend their wealth in the way of Allah is like a seed of grain that sprouts seven ears; in every ear there are a hundred grains." <strong>(Quran 2:261)</strong>
                    </p>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; color: #33691E; font-weight: 600; margin-bottom: 10px; font-size: 15px;">Choose Your Amount:</label>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 15px;">
                            <button onclick="setVoluntaryAmount(10)" class="quick-amount-btn" style="padding: 12px; background: white; color: #7CB342; border: 2px solid #7CB342; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;">
                                ${formatCurrency(10, state.selectedCurrency)}
                            </button>
                            <button onclick="setVoluntaryAmount(25)" class="quick-amount-btn" style="padding: 12px; background: white; color: #7CB342; border: 2px solid #7CB342; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;">
                                ${formatCurrency(25, state.selectedCurrency)}
                            </button>
                            <button onclick="setVoluntaryAmount(50)" class="quick-amount-btn" style="padding: 12px; background: white; color: #7CB342; border: 2px solid #7CB342; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;">
                                ${formatCurrency(50, state.selectedCurrency)}
                            </button>
                            <button onclick="setVoluntaryAmount(100)" class="quick-amount-btn" style="padding: 12px; background: white; color: #7CB342; border: 2px solid #7CB342; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;">
                                ${formatCurrency(100, state.selectedCurrency)}
                            </button>
                        </div>
                        
                        <input type="number" id="voluntary-amount" placeholder="Or enter your own amount" min="1" step="0.01" max="10000000"
                            style="width: 100%; padding: 14px; border: 2px solid #7CB342; border-radius: 8px; font-size: 16px; font-weight: 700; text-align: center;"
                            oninput="updateVoluntaryDisplayAmount()">
                    </div>
                    
                    <div style="background: #F0F8FF; padding: 15px; border-radius: 8px; border: 2px solid #4A90E2; margin-bottom: 20px;">
                        <label style="display: flex; align-items: start; cursor: pointer; gap: 10px;">
                            <input type="checkbox" id="voluntary-giftaid-checkbox" style="margin-top: 4px; width: 20px; height: 20px; cursor: pointer; accent-color: #4A90E2;">
                            <div>
                                <strong style="color: #1E3A8A; font-size: 14px; display: block; margin-bottom: 5px;">Add Gift Aid (UK taxpayers only)</strong>
                                <span style="color: #4A5568; font-size: 12px; line-height: 1.5;">
                                    Boost your donation by 25p for every £1 at no cost to you. 
                                    I am a UK taxpayer and understand that if I pay less Income Tax and/or Capital Gains Tax than the amount of Gift Aid claimed on all my donations in that tax year it is my responsibility to pay any difference.
                                </span>
                            </div>
                        </label>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px; padding: 20px; background: #F9FBF9; border-radius: 8px;">
                        <div style="color: #558B2F; font-size: 14px; margin-bottom: 5px; font-weight: 600;">You're donating:</div>
                        <div id="voluntary-display-amount" style="font-size: 36px; font-weight: 900; color: #33691E;">
                            ${formatCurrency(0, state.selectedCurrency)}
                        </div>
                    </div>
                    
                    <p style="color: #33691E; font-weight: 700; font-size: 16px; text-align: center; margin-bottom: 15px;">
                        Choose how to pay:
                    </p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div style="background: white; padding: 20px; border-radius: 12px; border: 3px solid #7CB342; text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 8px;">💚</div>
                            <div style="color: #33691E; font-weight: 900; font-size: 18px; margin-bottom: 10px;">No Fees</div>
                            <div style="color: #666; font-size: 12px; margin-bottom: 12px;">100% to charity</div>
                            <button onclick="openVoluntaryPayPalGivingFund()" style="width: 100%; background: #7CB342; color: white; padding: 14px; border: none; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer;">
                                Choose This
                            </button>
                        </div>
                        
                        <div style="background: white; padding: 20px; border-radius: 12px; border: 3px solid #0070BA; text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 8px;">⚡</div>
                            <div style="color: #0070BA; font-weight: 900; font-size: 18px; margin-bottom: 10px;">Quick &amp; Easy</div>
                            <div style="color: #666; font-size: 12px; margin-bottom: 12px;">Pre-filled amount</div>
                            <button onclick="openVoluntaryPayPalStandard()" style="width: 100%; background: #0070BA; color: white; padding: 14px; border: none; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer;">
                                Choose This
                            </button>
                        </div>
                    </div>
                    
                    <button onclick="showBankDetails()" style="width: 100%; background: white; color: #7CB342; padding: 14px; border: 2px solid #7CB342; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; margin-bottom: 15px;">
                        🏦 Bank Transfer
                    </button>
                    
                    <div id="bank-details" style="display: none; margin-top: 15px; padding: 20px; background: #F9FBF9; border-radius: 8px; border-left: 4px solid #7CB342;">
                        <p style="color: #33691E; font-weight: 700; margin-bottom: 15px; font-size: 16px;">Bank Transfer Details:</p>
                        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                            <p style="color: #666; font-size: 14px; margin: 8px 0;"><strong>Account Name:</strong> Gloucester Zakat Fund</p>
                            <p style="color: #666; font-size: 14px; margin: 8px 0;"><strong>Sort Code:</strong> <span style="font-family: monospace; background: #E8F5E9; padding: 4px 8px; border-radius: 4px;">40-22-09</span></p>
                            <p style="color: #666; font-size: 14px; margin: 8px 0;"><strong>Account Number:</strong> <span style="font-family: monospace; background: #E8F5E9; padding: 4px 8px; border-radius: 4px;">32684810</span></p>
                            <p style="color: #666; font-size: 14px; margin: 8px 0;"><strong>Reference:</strong> <span style="font-family: monospace; background: #E8F5E9; padding: 4px 8px; border-radius: 4px;">LILLAH${new Date().getFullYear()}</span></p>
                        </div>
                    </div>
                    
                    <p style="text-align: center; color: #999; font-size: 13px; margin-top: 20px; font-style: italic;">
                        May Allah accept your charity and multiply your reward 🤲
                    </p>
                </div>
            </div>
        `}

        <div class="info-box">
            <strong>Important Notes:</strong><br>
            • This is a one-time calculation for reference only<br>
            • Zakat is due after wealth remains above nisab for one full lunar year (354 days)<br>
            • Please consult with a qualified Islamic scholar for specific guidance<br>
            • Gloucester Zakat Fund distributes your Zakat to those in need
        </div>

        <div style="text-align: center; margin-top: 25px;">
            <button class="btn-download" onclick="downloadSummaryPDF()">📄 Download PDF</button>
            <button class="btn-download" onclick="printSummary()">🖨️ Print Summary</button>
            <button class="btn-restart" onclick="location.reload()">Start New Calculation</button>
        </div>
    `;
}

function renderDynamicList(title, listKey, placeholder, helpText = '') {
    return `
        <div class="form-group">
            <label class="form-label">${title}</label>
            ${helpText ? `<div class="help-text">${helpText}</div>` : ''}
            ${state[listKey].map((item, idx) => `
                <div class="list-item">
                    <input type="text" class="form-input" placeholder="${placeholder}" maxlength="100"
                        value="${sanitizeHTML(item.name)}" oninput="updateListItemLive('${listKey}', ${idx}, 'name', this.value)">
                    <input type="number" class="form-input" placeholder="Amount" min="0" max="100000000" step="0.01"
                        value="${item.amount}" oninput="updateListItemLive('${listKey}', ${idx}, 'amount', this.value)">
                    <button class="btn-remove" onclick="removeListItem('${listKey}', ${idx})">✕</button>
                </div>
            `).join('')}
            <button class="btn-add" onclick="addListItem('${listKey}')">${title.replace(/s$/, '')}</button>
        </div>
    `;
}

function updateListItemLive(listKey, idx, field, value) {
    state[listKey][idx][field] = value;
    updateFooter();
}

function changeCurrency(code) {
    state.selectedCurrency = code;
    render();
}

function nextStep() {
    if (state.currentStep < state.totalSteps) {
        state.currentStep++;
        render();
        window.scrollTo(0, 0);
    }
}

function previousStep() {
    if (state.currentStep > 1) {
        state.currentStep--;
        render();
        window.scrollTo(0, 0);
    }
}

function addGoldItem() {
    document.getElementById('goldItemName').value = '';
    document.getElementById('goldWeight').value = '';
    document.getElementById('goldCarat').value = '18K';
    document.getElementById('goldValue').value = '';
    
    setGoldInputType('weight');
    
    document.getElementById('goldModal').classList.add('active');
    document.getElementById('goldModal').dataset.mode = 'add';
    document.getElementById('goldModal').dataset.editIndex = '';
    
    document.querySelector('#goldModal .modal-title').textContent = 'Add Gold Item';
}

function editGoldItem(idx) {
    const item = state.goldItems[idx];
    
    document.getElementById('goldItemName').value = item.name;
    
    if (item.inputType === 'weight') {
        setGoldInputType('weight');
        document.getElementById('goldWeight').value = item.weight;
        document.getElementById('goldCarat').value = item.carat;
    } else {
        setGoldInputType('value');
        document.getElementById('goldValue').value = convertFromGBP(item.valueGBP, state.selectedCurrency).toFixed(2);
    }
    
    document.getElementById('goldModal').classList.add('active');
    document.getElementById('goldModal').dataset.mode = 'edit';
    document.getElementById('goldModal').dataset.editIndex = idx;
    
    document.querySelector('#goldModal .modal-title').textContent = 'Edit Gold Item';
}

function closeGoldModal() {
    document.getElementById('goldModal').classList.remove('active');
}

function setGoldInputType(type) {
    const weightInputs = document.getElementById('goldWeightInputs');
    const valueInputs = document.getElementById('goldValueInputs');
    const weightBtn = document.getElementById('goldWeightBtn');
    const valueBtn = document.getElementById('goldValueBtn');
    
    if (type === 'weight') {
        weightInputs.style.display = 'block';
        valueInputs.style.display = 'none';
        weightBtn.classList.add('active');
        valueBtn.classList.remove('active');
    } else {
        weightInputs.style.display = 'none';
        valueInputs.style.display = 'block';
        weightBtn.classList.remove('active');
        valueBtn.classList.add('active');
    }
}

function saveGoldItem() {
    const name = document.getElementById('goldItemName').value.trim();
    if (!name) {
        alert('Please enter an item name');
        return;
    }
    
    const modal = document.getElementById('goldModal');
    const mode = modal.dataset.mode;
    const editIndex = modal.dataset.editIndex;
    
    const weightInputVisible = document.getElementById('goldWeightInputs').style.display !== 'none';
    
    let item;
    if (weightInputVisible) {
        const weight = sanitizeNumber(document.getElementById('goldWeight').value, 0, 100000);
        const carat = document.getElementById('goldCarat').value;
        
        if (weight <= 0) {
            alert('Please enter a valid weight');
            return;
        }
        
        item = {
            name,
            inputType: 'weight',
            weight: weight,
            carat,
            value: 0,
            valueGBP: 0
        };
    } else {
        const value = sanitizeNumber(document.getElementById('goldValue').value, 0, 10000000);
        
        if (value <= 0) {
            alert('Please enter a valid value');
            return;
        }
        
        const valueGBP = convertToGBP(value, state.selectedCurrency);
        item = {
            name,
            inputType: 'value',
            weight: 0,
            carat: '24K',
            value: value,
            valueGBP
        };
    }
    
    if (mode === 'edit' && editIndex !== '') {
        state.goldItems[parseInt(editIndex)] = item;
    } else {
        state.goldItems.push(item);
    }
    
    closeGoldModal();
    render();
}

function removeGoldItem(idx) {
    if (confirm('Remove this gold item?')) {
        state.goldItems.splice(idx, 1);
        render();
    }
}

function setSilverMode(mode) {
    state.silverInputMode = mode;
    render();
}

function addListItem(listKey) {
    state[listKey].push({ name: '', amount: '' });
    render();
}

function removeListItem(listKey, idx) {
    state[listKey].splice(idx, 1);
    render();
}

function updateFooter() {
    const totals = calculateTotals();
    
    const assetsElements = document.querySelectorAll('.total-value.assets');
    const liabilitiesElements = document.querySelectorAll('.total-value.liabilities');
    const netAssetsElements = document.querySelectorAll('.total-value:not(.assets):not(.liabilities)');
    const zakatAmountElement = document.querySelector('.zakat-amount');
    const zakatLabelElement = document.querySelector('.zakat-label');
    
    if (assetsElements.length > 0) {
        assetsElements[0].textContent = formatCurrency(convertFromGBP(totals.assets, state.selectedCurrency), state.selectedCurrency);
    }
    
    if (liabilitiesElements.length > 0) {
        liabilitiesElements[0].textContent = formatCurrency(convertFromGBP(totals.liabilities, state.selectedCurrency), state.selectedCurrency);
    }
    
    if (netAssetsElements.length > 0) {
        netAssetsElements[0].textContent = formatCurrency(convertFromGBP(totals.netAssets, state.selectedCurrency), state.selectedCurrency);
    }
    
    if (zakatAmountElement) {
        zakatAmountElement.textContent = formatCurrency(convertFromGBP(totals.zakatPayable, state.selectedCurrency), state.selectedCurrency);
    }
    
    if (zakatLabelElement) {
        zakatLabelElement.textContent = totals.isAboveNisab ? '✓ Above Nisab - Zakat Due:' : '✗ Below Nisab';
    }
}

function printSummary() {
    downloadSummaryPDF();
}

function addQuickStock() {
    const nameInput = document.getElementById('quickStockName');
    const valueInput = document.getElementById('quickStockValue');
    
    const name = nameInput.value.trim() || 'Stock Portfolio';
    const value = sanitizeNumber(valueInput.value, 0, 100000000);
    
    if (value <= 0) {
        alert('Please enter a valid portfolio value');
        return;
    }
    
    state.stocksAndShares.push({
        name: name,
        amount: value.toString()
    });
    
    nameInput.value = '';
    valueInput.value = '';
    document.getElementById('quickZakatableAmount').textContent = '—';
    document.getElementById('quickZakatDue').textContent = '—';
    
    render();
}

function updateQuickStockCalculator(value) {
    const portfolioValue = sanitizeNumber(value, 0, 100000000);
    
    const zakatableAmount = portfolioValue * 0.4;
    const zakatDue = zakatableAmount * 0.025;
    
    const zakatableEl = document.getElementById('quickZakatableAmount');
    const zakatDueEl = document.getElementById('quickZakatDue');
    
    if (portfolioValue > 0) {
        zakatableEl.textContent = formatCurrency(zakatableAmount, state.selectedCurrency);
        zakatDueEl.textContent = formatCurrency(zakatDue, state.selectedCurrency);
    } else {
        zakatableEl.textContent = '—';
        zakatDueEl.textContent = '—';
    }
}

function downloadSummaryPDF() {
    const totals = calculateTotals();
    const currentDate = new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
    
    function formatListItems(items, multiplier = 1) {
        if (!items || items.length === 0) return '';
        return items.map(item => {
            const amount = sanitizeNumber(item.amount);
            const finalAmount = amount * multiplier;
            return `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">${sanitizeHTML(item.name)}</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(finalAmount, state.selectedCurrency)}</td></tr>`;
        }).join('');
    }
    
    let assetsBreakdown = '';
    
    if (state.goldItems && state.goldItems.length > 0) {
        assetsBreakdown += `
            <tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #558B2F; background: #F9FBF9;">Gold Items</td></tr>
            ${state.goldItems.map(item => {
                const caratMultipliers = { '24K': 1, '22K': 0.916, '21K': 0.875, '18K': 0.75, '14K': 0.583, '9K': 0.375 };
                const multiplier = caratMultipliers[item.carat] || 1;
                const pureGold = sanitizeNumber(item.weight) * multiplier;
                const valueGBP = item.inputType === 'weight' 
                    ? pureGold * state.goldPriceGBP 
                    : sanitizeNumber(item.value);
                const displayValue = convertFromGBP(valueGBP, state.selectedCurrency);
                return `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">${sanitizeHTML(item.name)} (${sanitizeHTML(item.carat)})</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(displayValue, state.selectedCurrency)}</td></tr>`;
            }).join('')}
        `;
    }
    
    if ((state.silverWeight && parseFloat(state.silverWeight) > 0) || (state.silverValue && parseFloat(state.silverValue) > 0)) {
        const silverValGBP = state.silverInputMode === 'weight' 
            ? sanitizeNumber(state.silverWeight) * state.silverPriceGBP 
            : sanitizeNumber(state.silverValue);
        const displaySilver = convertFromGBP(silverValGBP, state.selectedCurrency);
        assetsBreakdown += `
            <tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #558B2F; background: #F9FBF9;">Silver</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Silver ${state.silverInputMode === 'weight' ? `(${state.silverWeight}g)` : ''}</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(displaySilver, state.selectedCurrency)}</td></tr>
        `;
    }
    
    if (state.cashInHand && parseFloat(state.cashInHand) > 0) {
        const displayCash = sanitizeNumber(state.cashInHand);
        assetsBreakdown += `
            <tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #558B2F; background: #F9FBF9;">Cash & Liquid Assets</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Cash in Hand</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(displayCash, state.selectedCurrency)}</td></tr>
        `;
    }
    
    if (state.bankAccounts && state.bankAccounts.length > 0) {
        if (!assetsBreakdown.includes('Cash & Liquid Assets')) {
            assetsBreakdown += `<tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #558B2F; background: #F9FBF9;">Cash & Liquid Assets</td></tr>`;
        }
        assetsBreakdown += formatListItems(state.bankAccounts);
    }
    
    if (state.digitalWallets && state.digitalWallets.length > 0) assetsBreakdown += formatListItems(state.digitalWallets);
    if (state.crypto && state.crypto.length > 0) assetsBreakdown += formatListItems(state.crypto);
    if (state.isas && state.isas.length > 0) assetsBreakdown += formatListItems(state.isas);
    
    if (state.stocksAndShares && state.stocksAndShares.length > 0) {
        assetsBreakdown += `<tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #558B2F; background: #F9FBF9;">Stocks & Shares (40% zakatable)</td></tr>`;
        assetsBreakdown += formatListItems(state.stocksAndShares, 0.4);
    }
    
    if (state.otherAssets && state.otherAssets.length > 0) {
        assetsBreakdown += `<tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #558B2F; background: #F9FBF9;">Other Assets</td></tr>`;
        assetsBreakdown += formatListItems(state.otherAssets);
    }
    
    if ((state.businessStockValue && parseFloat(state.businessStockValue) > 0) ||
        (state.businessInvoices && parseFloat(state.businessInvoices) > 0) ||
        (state.businessAccounts && state.businessAccounts.length > 0)) {
        assetsBreakdown += `<tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #558B2F; background: #F9FBF9;">Business Assets</td></tr>`;
        
        if (state.businessStockValue && parseFloat(state.businessStockValue) > 0) {
            const displayBizStock = sanitizeNumber(state.businessStockValue);
            assetsBreakdown += `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Business Stock/Inventory</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(displayBizStock, state.selectedCurrency)}</td></tr>`;
        }
        if (state.businessInvoices && parseFloat(state.businessInvoices) > 0) {
            const displayBizInv = sanitizeNumber(state.businessInvoices);
            assetsBreakdown += `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Business Invoices</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(displayBizInv, state.selectedCurrency)}</td></tr>`;
        }
        if (state.businessAccounts && state.businessAccounts.length > 0) {
            assetsBreakdown += formatListItems(state.businessAccounts);
        }
    }
    
    if (state.receivables && state.receivables.length > 0) {
        assetsBreakdown += `<tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #558B2F; background: #F9FBF9;">Money Owed to You</td></tr>`;
        assetsBreakdown += formatListItems(state.receivables);
    }
    
    if (state.includeDCPension && state.pensionValue && parseFloat(state.pensionValue) > 0) {
        const pensionVal = sanitizeNumber(state.pensionValue);
        assetsBreakdown += `<tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #558B2F; background: #F9FBF9;">Pension (DC Accessible)</td></tr>`;
        assetsBreakdown += `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Pension Pot (40% zakatable)</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(pensionVal * 0.4, state.selectedCurrency)}</td></tr>`;
    }
    
    let liabilitiesBreakdown = '';
    
    if (state.creditCards && state.creditCards.length > 0) {
        liabilitiesBreakdown += `<tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #8D6E63; background: #F9FBF9;">Credit & Loans</td></tr>`;
        liabilitiesBreakdown += formatListItems(state.creditCards);
    }
    if (state.personalLoans && state.personalLoans.length > 0) {
        if (!liabilitiesBreakdown.includes('Credit & Loans')) {
            liabilitiesBreakdown += `<tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #8D6E63; background: #F9FBF9;">Credit & Loans</td></tr>`;
        }
        liabilitiesBreakdown += formatListItems(state.personalLoans);
    }
    
    if ((state.studentLoans && parseFloat(state.studentLoans) > 0) ||
        (state.carFinance && parseFloat(state.carFinance) > 0) ||
        (state.councilTax && parseFloat(state.councilTax) > 0) ||
        (state.mortgageOrRent && parseFloat(state.mortgageOrRent) > 0)) {
        liabilitiesBreakdown += `<tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #8D6E63; background: #F9FBF9;">Fixed Liabilities</td></tr>`;
        
        if (state.studentLoans && parseFloat(state.studentLoans) > 0) {
            const displaySL = sanitizeNumber(state.studentLoans);
            liabilitiesBreakdown += `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Student Loans</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(displaySL, state.selectedCurrency)}</td></tr>`;
        }
        if (state.carFinance && parseFloat(state.carFinance) > 0) {
            const displayCF = sanitizeNumber(state.carFinance);
            liabilitiesBreakdown += `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Car Finance</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(displayCF, state.selectedCurrency)}</td></tr>`;
        }
        if (state.councilTax && parseFloat(state.councilTax) > 0) {
            const displayCT = sanitizeNumber(state.councilTax);
            liabilitiesBreakdown += `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Council Tax</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(displayCT, state.selectedCurrency)}</td></tr>`;
        }
        if (state.mortgageOrRent && parseFloat(state.mortgageOrRent) > 0) {
            const displayMR = sanitizeNumber(state.mortgageOrRent);
            liabilitiesBreakdown += `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Mortgage/Rent (Capital)</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(displayMR, state.selectedCurrency)}</td></tr>`;
        }
    }
    
    if (state.otherBills && state.otherBills.length > 0) {
        liabilitiesBreakdown += `<tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #8D6E63; background: #F9FBF9;">Other Bills</td></tr>`;
        liabilitiesBreakdown += formatListItems(state.otherBills);
    }
    
    if ((state.businessTaxes && parseFloat(state.businessTaxes) > 0) ||
        (state.businessLoans && state.businessLoans.length > 0) ||
        (state.overdrafts && state.overdrafts.length > 0) ||
        (state.invoicesOwed && state.invoicesOwed.length > 0)) {
        liabilitiesBreakdown += `<tr><td colspan="2" style="padding: 12px 8px 4px 8px; font-weight: bold; color: #8D6E63; background: #F9FBF9;">Business Liabilities</td></tr>`;
        
        if (state.businessTaxes && parseFloat(state.businessTaxes) > 0) {
            const displayBT = sanitizeNumber(state.businessTaxes);
            liabilitiesBreakdown += `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Business Taxes</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(displayBT, state.selectedCurrency)}</td></tr>`;
        }
        if (state.businessLoans && state.businessLoans.length > 0) liabilitiesBreakdown += formatListItems(state.businessLoans);
        if (state.overdrafts && state.overdrafts.length > 0) liabilitiesBreakdown += formatListItems(state.overdrafts);
        if (state.invoicesOwed && state.invoicesOwed.length > 0) liabilitiesBreakdown += formatListItems(state.invoicesOwed);
    }
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Zakat Calculation Summary - ${currentDate}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #333;
                }
                h1 {
                    color: #558B2F;
                    text-align: center;
                    margin-bottom: 10px;
                }
                .header-info {
                    text-align: center;
                    color: #666;
                    margin-bottom: 30px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 25px;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #558B2F;
                    margin: 25px 0 15px 0;
                    padding-bottom: 8px;
                    border-bottom: 2px solid #7CB342;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 15px 0;
                    border-bottom: 1px solid #eee;
                }
                .summary-row:last-child {
                    border-top: 3px solid #7CB342;
                    border-bottom: none;
                    padding-top: 20px;
                    margin-top: 15px;
                    font-size: 20px;
                    font-weight: bold;
                }
                .label {
                    font-weight: 600;
                }
                .value {
                    font-weight: 700;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #eee;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <h1>🌿 Zakat Calculation Summary</h1>
            <div class="header-info">
                <p><strong>Gloucester Zakat Fund</strong></p>
                <p>Calculation Date: ${currentDate}</p>
                <p>Currency: ${state.selectedCurrency}</p>
            </div>
            
            ${assetsBreakdown ? `
                <div class="section-title">📊 Assets Breakdown</div>
                <table>
                    ${assetsBreakdown}
                </table>
            ` : ''}
            
            ${liabilitiesBreakdown ? `
                <div class="section-title">💳 Liabilities Breakdown</div>
                <table>
                    ${liabilitiesBreakdown}
                </table>
            ` : ''}
            
            <div class="section-title">💰 Zakat Calculation Summary</div>
            <div class="summary-row">
                <span class="label">Total Assets:</span>
                <span class="value" style="color: #7CB342;">${formatCurrency(convertFromGBP(totals.assets, state.selectedCurrency), state.selectedCurrency)}</span>
            </div>
            <div class="summary-row">
                <span class="label">Total Liabilities:</span>
                <span class="value" style="color: #8D6E63;">${formatCurrency(convertFromGBP(totals.liabilities, state.selectedCurrency), state.selectedCurrency)}</span>
            </div>
            <div class="summary-row">
                <span class="label">Net Assets:</span>
                <span class="value">${formatCurrency(convertFromGBP(totals.netAssets, state.selectedCurrency), state.selectedCurrency)}</span>
            </div>
            <div class="summary-row">
                <span class="label">Nisab Threshold:</span>
                <span class="value" style="color: #F9A825;">${formatCurrency(convertFromGBP(state.nisabGBP, state.selectedCurrency), state.selectedCurrency)}</span>
            </div>
            <div class="summary-row">
                <span class="label">Zakat Due (2.5%):</span>
                <span class="value" style="color: #558B2F;">${formatCurrency(convertFromGBP(totals.zakatPayable, state.selectedCurrency), state.selectedCurrency)}</span>
            </div>
            
            <div class="footer">
                <p><strong>Important Notes:</strong></p>
                <ul>
                    <li>This is a one-time calculation for reference only</li>
                    <li>Zakat is due after wealth remains above nisab for one full lunar year (354 days)</li>
                    <li>Please consult with a qualified Islamic scholar for specific guidance</li>
                    <li>Gloucester Zakat Fund distributes your Zakat to those in need</li>
                </ul>
                <p style="margin-top: 20px; text-align: center;">Generated by Gloucester Zakat Fund Calculator</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ✅ FIXED: Donation type toggle with payment button visibility
function setDonationType(type) {
    selectedDonationType = type;
    
    const zakatBtn = document.getElementById('zakat-type-btn');
    const sadaqahLillahBtn = document.getElementById('sadaqah-lillah-type-btn');
    const paymentSection = document.getElementById('payment-amount-section');
    
    if (zakatBtn) {
        zakatBtn.style.background = 'white';
        zakatBtn.style.color = '#7CB342';
    }
    if (sadaqahLillahBtn) {
        sadaqahLillahBtn.style.background = 'white';
        sadaqahLillahBtn.style.color = '#7CB342';
    }
    
    if (type === 'zakat' && zakatBtn) {
        zakatBtn.style.background = '#7CB342';
        zakatBtn.style.color = 'white';
    } else if (type === 'sadaqah-lillah' && sadaqahLillahBtn) {
        sadaqahLillahBtn.style.background = '#7CB342';
        sadaqahLillahBtn.style.color = 'white';
    }
    
    if (paymentSection) {
        paymentSection.style.display = 'block';
    }
    
    updateBankReference();
    updatePaymentButtonsVisibility();
}

// ✅ SECURITY: Generate bank reference
function generateBankReference(type) {
    const prefix = type === 'zakat' ? 'ZKT' : 'SDL';
    const now = new Date();
    const dateStr = now.getFullYear().toString().slice(-2) + 
                    String(now.getMonth() + 1).padStart(2, '0') + 
                    String(now.getDate()).padStart(2, '0');
    
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randomCode = '';
    for (let i = 0; i < 4; i++) {
        randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return `${prefix}-${dateStr}-${randomCode}`;
}

function updateBankReference() {
    const refDisplay = document.getElementById('bank-reference-display');
    if (refDisplay) {
        refDisplay.textContent = generateBankReference(selectedDonationType);
    }
}

// ✅ FIXED: Show/hide payment buttons based on donation type
function updatePaymentButtonsVisibility() {
    const noFeesDiv = document.getElementById('no-fees-payment-option');
    const quickEasyDiv = document.getElementById('quick-easy-payment-option');
    
    if (!noFeesDiv || !quickEasyDiv) return;
    
    if (selectedDonationType === 'zakat') {
        noFeesDiv.style.display = 'block';
        quickEasyDiv.style.display = 'none';
    } else {
        noFeesDiv.style.display = 'block';
        quickEasyDiv.style.display = 'block';
    }
}

function setPaymentAmount(type) {
    const fullBtn = document.getElementById('full-amount-btn');
    const partialBtn = document.getElementById('partial-amount-btn');
    const partialInput = document.getElementById('partial-amount-input');
    const customAmount = document.getElementById('custom-amount');
    const displayAmount = document.getElementById('display-amount');
    
    if (type === 'full') {
        fullBtn.style.background = '#7CB342';
        fullBtn.style.color = 'white';
        partialBtn.style.background = 'white';
        partialBtn.style.color = '#7CB342';
        partialInput.style.display = 'none';
        
        const totals = calculateTotals();
        const amount = convertFromGBP(totals.zakatPayable, state.selectedCurrency);
        if (displayAmount) {
            displayAmount.textContent = formatCurrency(amount, state.selectedCurrency);
        }
    } else {
        fullBtn.style.background = 'white';
        fullBtn.style.color = '#7CB342';
        partialBtn.style.background = '#7CB342';
        partialBtn.style.color = 'white';
        partialInput.style.display = 'block';
        
        const amount = sanitizeNumber(customAmount.value, 0, 10000000);
        if (displayAmount) {
            displayAmount.textContent = formatCurrency(amount, state.selectedCurrency);
        }
    }
}

function showBankDetails() {
    const bankDetails = document.getElementById('bank-details');
    if (bankDetails) {
        bankDetails.style.display = 'block';
    }
}

function getSelectedAmount() {
    const customAmountEl = document.getElementById('custom-amount');
    const partialInput = document.getElementById('partial-amount-input');
    const totals = calculateTotals();
    
    let amount = convertFromGBP(totals.zakatPayable, state.selectedCurrency);
    
    if (partialInput && partialInput.style.display !== 'none' && customAmountEl) {
        const customValue = sanitizeNumber(customAmountEl.value, 0, 10000000);
        if (customValue > 0) {
            amount = customValue;
        }
    }
    
    return amount;
}

function updatePayPalButtonAmount() {
    const amount = getSelectedAmount();
    const displayEl = document.getElementById('display-amount');
    if (displayEl) {
        displayEl.textContent = formatCurrency(amount, state.selectedCurrency);
    }
}

// ✅ FIXED: PayPal Giving Fund with shortened message
function openPayPalGivingFund() {
    const amount = getSelectedAmount();
    const giftAidCheckbox = document.getElementById('giftaid-checkbox');
    const giftAid = giftAidCheckbox && giftAidCheckbox.checked ? 'Yes' : 'No';
    
    const zakatBtn = document.getElementById('zakat-type-btn');
    const donationType = (zakatBtn && (zakatBtn.style.background.includes('124, 179, 66') || zakatBtn.style.background.includes('#7CB342'))) ? 'Zakat' : 'Lillah';
    
    let message = `You're donating ${formatCurrency(amount, state.selectedCurrency)} (${donationType})\n\n`;
    message += `On PayPal, enter: ${formatCurrency(amount, state.selectedCurrency)}`;
    
    if (giftAid === 'Yes') {
        message += `\n\n🎁 GIFT AID BONUS!\n`;
        message += `After donating, PayPal will email you a Gift Aid form.\n`;
        message += `Please complete it so we can claim £${(amount * 0.25).toFixed(2)} extra from the government!`;
    }
    
    alert(message);
    window.open('https://www.paypal.com/gb/fundraiser/charity/5731751', '_blank');
}

// ✅ SECURITY: PayPal Standard with validation
function openPayPalStandard() {
    const amount = getSelectedAmount();
    
    if (amount <= 0 || amount > 10000000) {
        alert('Invalid donation amount');
        return;
    }
    
    const giftAidCheckbox = document.getElementById('giftaid-checkbox');
    const giftAid = giftAidCheckbox && giftAidCheckbox.checked ? 'Yes' : 'No';
    
    let donationType = selectedDonationType || 'lillah';
    
    const displayNames = {
        'zakat': 'Zakat',
        'lillah': 'Lillah',
        'sadaqah': 'Sadaqah'
    };
    
    const paypalUrl = 'https://www.paypal.com/cgi-bin/webscr?' +
        'cmd=_xclick&' +
        'business=gloucesterzf@gmail.com&' +
        'item_name=' + encodeURIComponent(`${displayNames[donationType]} Donation - Gloucester Zakat Fund`) + '&' +
        'amount=' + amount.toFixed(2) + '&' +
        'currency_code=' + state.selectedCurrency + '&' +
        'custom=' + encodeURIComponent(`TYPE:${donationType}|GIFTAID:${giftAid}`) + '&' +
        'no_shipping=1&' +
        'no_note=1&' +
        'return=' + encodeURIComponent('thank-you.html') + '&' +
        'cancel_return=' + encodeURIComponent('payment-cancelled.html');
    
    window.open(paypalUrl, '_blank');
}

// Voluntary donation functions
function setVoluntaryAmount(amount) {
    document.getElementById('voluntary-amount').value = amount;
    updateVoluntaryDisplayAmount();
}

function updateVoluntaryDisplayAmount() {
    const amountInput = document.getElementById('voluntary-amount');
    const amount = sanitizeNumber(amountInput.value, 0, 10000000);
    const displayEl = document.getElementById('voluntary-display-amount');
    
    if (displayEl) {
        displayEl.textContent = formatCurrency(amount, state.selectedCurrency);
    }
}

function getVoluntaryAmount() {
    const amountInput = document.getElementById('voluntary-amount');
    return sanitizeNumber(amountInput.value, 0, 10000000);
}

function openVoluntaryPayPalGivingFund() {
    const amount = getVoluntaryAmount();
    
    if (amount <= 0) {
        alert('Please enter an amount to donate');
        return;
    }
    
    const giftAidCheckbox = document.getElementById('voluntary-giftaid-checkbox');
    const giftAid = giftAidCheckbox && giftAidCheckbox.checked;
    
    let message = `You're donating ${formatCurrency(amount, state.selectedCurrency)} (Lillah)\n\n`;
    message += `On PayPal, enter: ${formatCurrency(amount, state.selectedCurrency)}`;
    
    if (giftAid) {
        message += `\n\n🎁 GIFT AID BONUS!\n`;
        message += `After donating, PayPal will email you a Gift Aid form.\n`;
        message += `Please complete it so we can claim £${(amount * 0.25).toFixed(2)} extra from the government!`;
    }
    
    alert(message);
    window.open('https://www.paypal.com/gb/fundraiser/charity/5731751', '_blank');
}

function openVoluntaryPayPalStandard() {
    const amount = getVoluntaryAmount();
    
    if (amount <= 0) {
        alert('Please enter an amount to donate');
        return;
    }
    
    const giftAidCheckbox = document.getElementById('voluntary-giftaid-checkbox');
    const giftAid = giftAidCheckbox && giftAidCheckbox.checked ? 'Yes' : 'No';
    
    const paypalUrl = 'https://www.paypal.com/cgi-bin/webscr?' +
        'cmd=_xclick&' +
        'business=gloucesterzf@gmail.com&' +
        'item_name=' + encodeURIComponent('Lillah Donation - Gloucester Zakat Fund') + '&' +
        'amount=' + amount.toFixed(2) + '&' +
        'currency_code=' + state.selectedCurrency + '&' +
        'custom=' + encodeURIComponent(`TYPE:lillah|GIFTAID:${giftAid}`) + '&' +
        'no_shipping=1&' +
        'no_note=1';
    
    window.open(paypalUrl, '_blank');
}

// Start
init();