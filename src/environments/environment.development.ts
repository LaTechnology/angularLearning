export const environment = {
    production: false,
    baseurl: 'http://localhost:4200',
    apiUrl : 'http://localhost:3000',
    displayedColumns : ['select', 'productName', 'size', 'brand', 'color', 'code', 'quantity', 'actions'],
    customerdisplayedColumns :  [
        'select',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'age',
        'actions',
      ],

    addressListDisplayedColumns: ["select","addressLine1","addressLine2","city","district","pincode","state","country","region","landMark","phoneNumber","addressType","actions"],
    locationListDisplayedColumns: ['select','name', 'billingAddress', 'shippingAddress', 'actions'],
    
 
};
  