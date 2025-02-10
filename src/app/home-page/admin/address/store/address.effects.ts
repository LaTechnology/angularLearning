import { Injectable } from "@angular/core";
import { AddressService } from "../address.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadAllAddresses } from "./address.action";
import * as AddressAction from './address.action'
import { catchError, map, mergeMap, of } from "rxjs";
import { error } from "console";
@Injectable()
export class AddressEffects {
    constructor(private actions$: Actions, private addressService: AddressService) {
    }
    loadAllAddresses$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AddressAction.loadAllAddresses),
            mergeMap(() =>

                this.addressService.getAllAddresses().pipe(
                    map(addresses => AddressAction.loadAllAddressesSuccess({ addresses })),
                    catchError(error => of(AddressAction.loadAllAddressesFailure({ error: error.message })))
                )
            )
        )
    )
}
