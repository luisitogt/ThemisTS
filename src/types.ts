import { OverriderClassType } from "./manager";

export type ThemeType = "dark" | "light" | "neutral"
export type BaseFonts  = "body" | "callout" | "caption1" | "caption2" | "footNote" | "headLine" | "subHead" | "largeTitle" | "title1" | "title2" | "title3";
export type BaseColors = "primary" | "secondary" | "primaryText" | "secondaryText" | "accent" | "contrary" | "border" | "success" | "error" | "warning";

export type ColorOpacities = {
    _10: string;
    _25: string;
    _50: string;
    _75: string;
    _90: string;
    _100: string; 
};

export type BaseOverriders = {
    colorOverriders : "light",
    layoutOverriders : string
}

export type OptionalFlag = "Y" | "N";

export type TurnToOptional<Object,Flag extends OptionalFlag = "Y"> =  Flag extends "Y" ? {
    [P in keyof Object]? : Object[P]
 } : {
    [P in keyof Object] : Object[P]
 } 

export type Merge<
    First extends string,
    FirstIsOptional extends OptionalFlag,
    Second extends string,
    SecondIsOptional extends string,
    Value> =(
        (FirstIsOptional extends "Y" ? {[P in First]? : Value} : {[P in First] : Value}) &
        (SecondIsOptional extends "Y" ? {[P in Second]? : Value} :  {[P in Second] : Value}) 
    )

export type ThemeCreator<
                Colors,
                Font,
                UserGeneratedData,
                Overriders extends undefined | object = undefined,
                FontClasses extends undefined | object = undefined> =  (
    {
        themeType : ThemeType,
        colors: Colors,
        fonts : Font,
    } & UserGeneratedData &
        (Overriders extends object ? {overriders: Overriders} : {}) &
        (FontClasses extends object ? {fontClasses: FontClasses} : {})
    )



export type ColorTypes = {
    normal : ColorOpacities,
    variant : ColorOpacities
}


export type FontAttributes<Class extends undefined | string = undefined> = ({
    size : string,
    weight : string,
    lineHeight? : string,
    family?: string
} & (Class extends string ? {class : Class} : {}))

export type ColorsObject<Value ,
                        ExtraColors extends string,
                        ExtraColorsIsOptional extends OptionalFlag,
                        BaseColorsIsOptional extends OptionalFlag> = (
                        Merge<ExtraColors,ExtraColorsIsOptional,BaseColors,BaseColorsIsOptional,Value> 
                        )

export type FontsObject<Value,
                        ExtraFonts extends string,
                        ExtraFontsIsOptional extends OptionalFlag,
                        BaseFontsIsOptional extends OptionalFlag> = (
                        Merge<ExtraFonts,ExtraFontsIsOptional,BaseFonts,BaseFontsIsOptional,Value> 
                        )

    
export type OverridersObject<
                Value,
                ExtraOverriders extends Record<string, string>,
                ExtraOverridersIsOptional extends OptionalFlag,
                BaseOverridersIsOptional extends OptionalFlag,
                > = TurnToOptional<{
                [P in keyof BaseOverriders]: MergeSubOverriders<
                    Value,
                    (P extends (keyof ExtraOverriders) ? ExtraOverriders[P] : string ),
                    ExtraOverridersIsOptional,
                    (P extends (keyof BaseOverriders) ? BaseOverriders[P] : string ),
                    BaseOverridersIsOptional> 
                } ,BaseOverridersIsOptional> & TurnToOptional<{
                [P in keyof ExtraOverriders]: MergeSubOverriders<
                    Value,
                    (P extends (keyof ExtraOverriders) ? ExtraOverriders[P] : string ),
                    ExtraOverridersIsOptional,
                    (P extends (keyof BaseOverriders) ? BaseOverriders[P] : string ),
                    BaseOverridersIsOptional> 
                },ExtraOverridersIsOptional> 


export type MergeSubOverriders<
            Value,
            ExtraOverriderValues extends string,
            ExtraOverridersIsOptional extends OptionalFlag,
            BaseOverriderValues extends string,
            BaseOverridersIsOptional extends OptionalFlag,
            > = (
            Merge<ExtraOverriderValues,ExtraOverridersIsOptional,BaseOverriderValues,BaseOverridersIsOptional,Value> 
            )
            
export type removeOverridersFunction =  {
                                        removeOverriders: (element? : HTMLElement) => void,
                                        switch : (base?: boolean,element? : HTMLElement) => void, 
                                        getCurrent : (element? : HTMLElement) => OverriderClassType | undefined }

export type MergeOverridersWithFunction<Overriders> = {[P in keyof Overriders]? : Overriders[P] & removeOverridersFunction}


// THEME CREATOR Overriders:

export type ThemeCreatorSimplified<
            EC extends string | ColorTypes,
            EF extends string,
            UG extends Record<string,string>,
            EO extends Record<string,string>,
            > = (
    ThemeCreator<
        ColorsObject<
            EC extends string ? string : ColorTypes,
            EC extends string ? EC : never ,
            "N",
            "Y"
        >,
        FontsObject<
            FontAttributes,
            EF,
            "N",
            "Y"
        >,
        CompleteUserGeneratedObjectOptional<UG,"N">,
        ThemeCreatorSimplifiedOverriders<EC extends string ? EC : never,EF,UG,EO>
    >
)

export type ThemeCreatorSimplifiedOverriders<
            EC extends string,
            EF extends string,
            UG extends Record<string,string>,
            EO extends Record<string,string>,
            > = (
                OverridersObject<
                    TurnToOptional<
                            ThemeCreator<
                                ColorsObject<
                                string,
                                EC,
                                "Y",
                                "Y"
                            >,
                            FontsObject<
                                FontAttributes,
                                EF,
                                "Y",
                                "Y"
                            >,
                            CompleteUserGeneratedObjectOptional<UG,"Y">
                        >
                    > 
                ,
                EO,
                "Y",
                "Y"
            >
    )

// THEME VARS

export type ThemeVarsSimplified<
            EC extends string,
            EF extends string,
            UG extends Record<string,string>,
            EO extends Record<string,string>
            > = (
                ThemeCreator<
                    ColorsObject<
                        ColorTypes,
                        EC,
                        "N",
                        "N"
                    >,
                    FontsObject<
                        FontAttributes<string>,
                        EF,
                        "N",
                        "N"
                    >,
                    CompleteUserGeneratedObjectOptional<UG,"N">,
                    MergeOverridersWithFunction<
                        OverridersObject<
                        {
                            className: "",
                            apply : (onElement?: HTMLElement) => void
                            remove : (onElement?: HTMLElement) => void
                        },
                        EO,
                        "N",
                        "N"
                    >>
                >
)

export type BaseInterfaceType = Record<string,string> | {
    colors : string,
    fonts : string,
    overriders?: Record<string,string>
}

export type UserGeneratedObject<T extends Record<string,any>> = {[P in keyof T as Exclude<P,"colors" | "fonts" | "overriders">] : T[P] extends string ? T[P] : never}
export type CompleteUserGeneratedObjectOptional<T extends Record<string,string>,IsOptional extends OptionalFlag> = (
    IsOptional extends "Y" ? {[P in keyof T]? : {[I in T[P]]? : string}} : {[P in keyof T] : {[I in T[P]] : string}}
)

export type FontClassesObject<ExtraFonts extends string, IsOptional extends OptionalFlag>  = (
IsOptional extends "Y" ? {[P in  ExtraFonts | BaseFonts]? : string} : {[P in ExtraFonts | BaseFonts]: string}
)

export interface ThemeInterface<
Data extends BaseInterfaceType,
Colors extends string = (Data["colors"] extends string ? Data["colors"] : string),
Fonts  extends string = (Data["fonts"] extends string ? Data["fonts"] : string),
UserGenerated extends Record<string,string> = UserGeneratedObject<Data>,
Overriders extends Record<string,string> = (Data["overriders"] extends Record<string,string>  ? Data["overriders"] : Record<string,string> ),
> {
    themeCreator : ThemeCreatorSimplified<Colors | ColorTypes, Fonts,UserGenerated,Overriders>
    themeVars?: ThemeVarsSimplified<Colors,Fonts,UserGenerated,Overriders>
    sheetSelector?: string;
}

