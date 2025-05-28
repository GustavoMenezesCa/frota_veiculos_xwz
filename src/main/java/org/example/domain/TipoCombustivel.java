package org.example.domain;

public enum TipoCombustivel {

    GASOLINA,
    ETANOL,
    DIESEL,
    FLEX;

    public static TipoCombustivel fromString(String tipoCombustivel){

        String tipoCombustivelFormat = tipoCombustivel.trim().toUpperCase();
        return TipoCombustivel.valueOf(tipoCombustivelFormat);
    }

    public static String fromTipoCombustivel(TipoCombustivel tipoCombustivel){
        return tipoCombustivel.toString();
    }
}





