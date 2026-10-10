import random
from typing import TypedDict

class MonthData(TypedDict):
    mese: str
    entrate: float
    uscite: float

def generate_financial_data() -> list[MonthData]:
    mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
    
    print("=== Generatore Dati Finanziari ===")
    try:
        min_spesa = float(input("Inserisci importo minimo (€): "))
        max_spesa = float(input("Inserisci importo massimo (€): "))
        
        if min_spesa < 0 or max_spesa < 0 or min_spesa > max_spesa:
            raise ValueError("Importi non validi")
    except ValueError as e:
        print(f"Errore: {e}")
        return []
    
    dati = []
    for mese in mesi:
        entrate = round(random.uniform(min_spesa, max_spesa), 2)
        uscite = round(random.uniform(min_spesa, max_spesa), 2)
        dati.append({'mese': mese, 'entrate': entrate, 'uscite': uscite})
    
    return dati

if __name__ == '__main__':
    risultato = generate_financial_data()
    for dato in risultato:
        print(f"{dato['mese']:12} - Entrate: €{dato['entrate']:7.2f}  Uscite: €{dato['uscite']:7.2f}")