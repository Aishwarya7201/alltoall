document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('converter-form') as HTMLFormElement | null;
    const resultElement = document.getElementById('result') as HTMLElement | null;
  
    if (form && resultElement) {
      form.addEventListener('submit', async function (event) {
        event.preventDefault();
  
        const amountInput = document.getElementById('amount') as HTMLInputElement | null;
        const fromCurrencyInput = document.getElementById('fromCurrency') as HTMLSelectElement | null;
        const toCurrencyInput = document.getElementById('toCurrency') as HTMLSelectElement | null;
  
        if (amountInput && fromCurrencyInput && toCurrencyInput) {
          const amount = parseFloat(amountInput.value);
          const fromCurrency = fromCurrencyInput.value;
          const toCurrency = toCurrencyInput.value;
  
          try {
            const response = await fetch('http://127.0.0.1:3000/api/convert', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ amount, fromCurrency, toCurrency })
            });
  
            if (response.ok) {
              const data = await response.json();
              resultElement.textContent = `Converted Amount: ${data.convertedAmount} ${toCurrency}`;
            } else {
              const errorData = await response.json();
              resultElement.textContent = `Error: ${errorData.error}`;
            }
          } catch (error: any) {
            resultElement.textContent = `Error: ${error.message}`;
          }
        }
      });
    } else {
      console.error('Required elements not found in the DOM');
    }
  });
  