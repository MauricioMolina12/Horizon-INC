import { Component, signal, inject, effect, computed } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProfileFacade } from '../../services/profile.facade';
import { ModalService } from '../../../../shared/components/modal/modal.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { AccordionComponent } from '../../../../shared/components/accordion/accordion.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isMain: boolean;
}

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    AccordionComponent,
    InputComponent,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
})
export class ProfileSettingsComponent {
  private profileFacade = inject(ProfileFacade);
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);

  readonly openSectionId = signal<string | null>(null);
  readonly saving = this.profileFacade.isUpdating;
  readonly saveSuccess = signal(false);
  readonly saveError = signal<string | null>(null);
  readonly deletingAccount = signal(false);

  readonly user = this.profileFacade.currentUser;

  readonly accountForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
  });

  readonly formValue = toSignal(
    this.accountForm.valueChanges.pipe(
      startWith(this.accountForm.getRawValue()),
    ),
  );

  private getChangedFields(): Record<string, string> {
    const user = this.user();
    if (!user) return {};

    const form = this.accountForm.getRawValue();

    const changes: Record<string, string> = {};

    if (form.name !== user.name) {
      changes['name'] = form.name;
    }

    if (form.username !== user.username) {
      changes['username'] = form.username;
    }

    if (form.phone !== user.phone) {
      changes['phone'] = form.phone;
    }

    return changes;
  }

  readonly hasChanges = computed(() => {
    this.formValue();
    return Object.keys(this.getChangedFields()).length > 0;
  });

  readonly showNewAddress = signal(false);
  readonly savingAddress = signal(false);
  readonly addressForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    country: ['', Validators.required],
  });

  readonly editingAddressId = signal<string | null>(null);
  readonly addressEditForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    country: ['', Validators.required],
  });

  private syncForm = effect(() => {
    if (this.saving()) return;

    const u = this.user();
    if (u) {
      this.accountForm.patchValue({
        name: u.name,
        username: u.username,
        phone: u.phone,
      });
      this.accountForm.markAsPristine();
    }
  });

  readonly sections = [
    {
      id: 'account',
      icon: 'ti ti-user',
      title: 'Cuenta',
      description: 'Nombre, email y teléfono',
    },
    // {
    //   id: 'addresses',
    //   icon: 'ti ti-map-pin',
    //   title: 'Direcciones',
    //   description: 'Gestiona tus direcciones de envío',
    // },
    {
      id: 'danger',
      icon: 'ti ti-alert-triangle',
      title: 'Zona de peligro',
      description: 'Acciones irreversibles',
      danger: true,
    },
  ];

  onAccordionToggle(sectionId: string, isOpen: boolean): void {
    this.openSectionId.set(isOpen ? sectionId : null);
    this.saveSuccess.set(false);
    this.saveError.set(null);
  }

  saveAccount(): void {
    if (this.accountForm.invalid) return;

    const u = this.user();
    if (!u) return;

    this.saveSuccess.set(false);
    this.saveError.set(null);

    const changedFields: Record<string, string> = {};
    const formVal = this.accountForm.value;

    if (formVal.name     !== u.name)        changedFields['full_name'] = formVal.name;
    if (formVal.username !== u.username)    changedFields['username']  = formVal.username;
    if (formVal.phone    !== u.phone)       changedFields['phone']     = formVal.phone;

    if (Object.keys(changedFields).length === 0) {
      setTimeout(() => this.saveSuccess.set(false), 3000);
      return;
    }

    this.profileFacade.updateUser(u.id, changedFields);
  }

  /* ADDRESSES  */

  get addresses(): Address[] {
    const u = this.user();
    if (!u?.address) return [];
    try {
      const parsed = JSON.parse(u.address);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return u.address
        ? [
            {
              id: '1',
              name: u.name,
              street: u.address,
              city: '',
              state: '',
              zip: '',
              country: u.countryId || '',
              isMain: true,
            },
          ]
        : [];
    }
  }

  toggleNewAddress(): void {
    this.showNewAddress.update((v) => !v);
    if (this.showNewAddress()) {
      this.addressForm.reset();
    }
  }

  saveNewAddress(): void {
    if (this.addressForm.invalid) return;

    this.savingAddress.set(true);
    const newAddr: Address = {
      id: crypto.randomUUID(),
      ...this.addressForm.value,
      isMain: false,
    };

    const current = this.addresses;
    const updated = [...current, newAddr];

    this.persistAddresses(updated, current.length === 0);
  }

  startEditAddress(addr: Address): void {
    this.editingAddressId.set(addr.id);
    this.addressEditForm.patchValue(addr);
  }

  cancelEditAddress(): void {
    this.editingAddressId.set(null);
  }

  saveEditAddress(): void {
    if (this.addressEditForm.invalid) return;

    const current = this.addresses;
    const updated = current.map((a) =>
      a.id === this.editingAddressId()
        ? { ...a, ...this.addressEditForm.value }
        : a,
    );

    this.persistAddresses(updated, false);
  }

  setMainAddress(id: string): void {
    const current = this.addresses;
    const updated = current.map((a) => ({
      ...a,
      isMain: a.id === id,
    }));
    this.persistAddresses(updated, false);
  }

  deleteAddress(id: string): void {
    const current = this.addresses;
    const updated = current.filter((a) => a.id !== id);
    this.persistAddresses(updated, updated.length > 0);
  }

  private persistAddresses(
    addresses: Address[],
    setFirstAsMain: boolean,
  ): void {
    const u = this.user();
    if (!u) return;

    const final = setFirstAsMain
      ? addresses.map((a, i) => ({ ...a, isMain: i === 0 }))
      : addresses;

    this.savingAddress.set(true);

    this.profileFacade.updateUser(u.id, { address: JSON.stringify(final) });
  }

  /* DANGER ZONE */
  deleteAccount(): void {
    const u = this.user();
    if (!u) return;

    this.modalService.open(DeleteConfirmationComponent, {
      size: 'sm',
    });
  }
}
