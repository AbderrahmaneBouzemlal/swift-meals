# Swift Meals — Svelte + Tailwind UI

Mobile-first food delivery app built with Svelte and Tailwind CSS. This frontend serves as the user interface for both buyers and sellers, providing a seamless experience for ordering meals and managing accounts.

## Pages

| Page                    | Route         | Description                    |
| ----------------------- | ------------- | ------------------------------ |
| Get Started             | `get-started` | Splash / onboarding screen     |
| **Choose Role** _(new)_ | `choose-role` | Select **Buyer** or **Seller** |
| Login                   | `login`       | Sign In / Sign Up choice       |
| Sign In                 | `sign-in`     | Email + password form          |
| Sign Up                 | `sign-up`     | Registration form              |
| My Account              | `account`     | Profile & navigation menu      |

## Navigation Flow

```
Get Started → Choose Role → Login → Sign In ──┐
                                  └── Sign Up ──┤→ My Account
```

## Setup

```bash
npm install
npm run dev
```

## Design Tokens

| Token          | Value          | Usage                         |
| -------------- | -------------- | ----------------------------- |
| Primary Yellow | `#FCBD0B`      | Buttons, accents, CTA         |
| Dark           | `#595454`      | Text, icons, headers          |
| Gray           | `#BDBDBD`      | Placeholders, secondary icons |
| Input BG       | `#F6F6F6`      | Form field backgrounds        |
| Font           | ABeeZee Italic | All typography                |

## Component Structure

```
src/
├── App.svelte                    # Root router
└── lib/
    └── components/
        ├── GetStarted.svelte     # Splash screen with animated logo
        ├── ChooseRole.svelte     # 🆕 Buyer vs Seller selection
        ├── Login.svelte          # Welcome + sign in/up choice
        ├── SignIn.svelte         # Email/password login
        ├── SignUp.svelte         # Registration form
        └── MyAccount.svelte      # Profile page with menu
```

## Notes

- All components use `createEventDispatcher` and emit `navigate` events
- The `App.svelte` handles routing via a simple reactive `currentPage` variable
- The `ChooseRole` component passes the selected role downstream so `Login` can display role-specific UI
- Components are self-contained with scoped `<style>` blocks; Tailwind is used for utility classes where appropriate
