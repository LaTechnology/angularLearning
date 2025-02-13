import { Injectable } from "@angular/core";
import { AddressService } from "../address.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as AddressAction from './address.action'; // Already importing actions properly
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()
export class AddressEffects {
  constructor(private actions$: Actions, private addressService: AddressService) {}

  loadAllAddresses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressAction.loadAllAddresses),
      mergeMap(() =>
        this.addressService.getAllAddresses().pipe(
          map((addresses) => AddressAction.loadAllAddressesSuccess({ addresses })),
          catchError((error) =>
            of(AddressAction.loadAllAddressesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadAddressById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressAction.loadAddressById),
      mergeMap((action) =>
        this.addressService.getAddressById(action.id).pipe(
          map((address) => AddressAction.loadAddressByIdSuccess({ address })),
          catchError((error) =>
            of(AddressAction.loadAddressByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
