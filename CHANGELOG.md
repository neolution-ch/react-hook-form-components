# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.9.0] - 2025-07-31

### Added

- property `fixedOptions` to `AsyncTypeaheadInput` and `StaticTypeaheadInput` component, to allow the option, to fix certain options and make them unremovable
- property `withFixedOptionsInValue` to `AsyncTypeaheadInput` and `StaticTypeaheadInput` component, to define, if the fixed options are included in the actual value or not, default is `true`
  - if yes, the fixed options have to be in the default form value (or defaultSelected for `AsyncTypeaheadInput`) and will always be included in the form value
  - if not, the fixed options are not allowed in the default form value (or defaultSelected for `AsyncTypeaheadInput`) and will never be added to the form value

## [3.8.0] - 2025-07-21

### Added

- property `onKeyDown` to `Input` component

## [3.7.1] - 2025-07-17

### Fixed

- hide all browser user profile suggestions when `autoComplete` is set to `off`

## [3.7.0] - 2025-07-08

### Added

- property `autoComplete` to `Form` component

## [3.6.1] - 2025-06-25

### Fixed

- wrong spread provided by MUI on `renderHighlightedOptionFunction`

## [3.6.0] - 2025-06-24

### Added

- New typeahead helper function `getAutosuggestHighlightParts`.

## [3.5.0] - 2025-06-18

### Changed

- - `date-fns` is now installed as dependency

### Fixed

- removed not needed dev dependencies

## [3.4.0] - 2025-06-11

### Changed

- migrated to eslint 9 flat config

## [3.3.0] - 2025-06-03

### Added

- property `placeholder` to `FormattedInput` component.

## [3.2.0] - 2025-04-30

### Added

- Export of typeahead helpers and `useDebounceHook` hook.

### Fixed

- Hide placeholder on multiple `AsyncTypeAheadInput` and `StaticTypeAheadInput` when at least one option is selected.
- Typeahead helpers return type from `TypeaheadOption[]` to `TypeaheadOptions`, since typeaheads are not intended to be used with mixed `string` and `LabelValueOption` options.

## [3.1.1] - 2025-04-10

### Fixed

- Selected options were still visible and selectable using multiple `AsyncTypeAheadInput`. This is now fixed and active options are now filtered on searching once have been previously selected.

## [3.1.0] - 2025-03-17

### Added

- `ColorPickerInput` component which provide both text input and color picker in order to choose color.
  1. The inputs accepts color in any format, but the picker will set the color in the format you provided as props. By default, this behaviour is prevented and onBlur the provided color will be parsed to specified format. In case you want to disable this behaviour, you can provide the `convertColorToFormatOrUndefinedOnBlur` property as false.
  2. Color Picker is by default with MUI style, use `useBootstrapStyle` property for applying a "bootstrap-like" style.

## [3.0.1] - 2025-03-05

### Fixed

- Selected option was wrongly filtered when using single `AsyncTypeAheadInput`. This is now fixed and active option is visible on searching even if has been selected.
- Both `AsyncTypeAheadInput` and `StaticTypeAheadInput` rendering options issue due to duplicated labels. By default, the new key is the concatenation of label and value in case of typeahead option type, and label in case of string option type. In case the issue persist with above change, you can use the `getOptionKey` property to override it with a unique key.
- Query for `AsyncTypeAheadInput`, which was wrongly executed with empty search string once the input was manually cleaned-up.

## [3.0.0] - 2025-03-03

### Changed

- :boom: `AsyncTypeAheadInput` based on MUI Autocomplete component.
- :boom: renamed `AsyncTypeaheadProps` to `AsyncTypeaheadInputProps`.

  1. The component is by default **form** controlled. However, updating values using form methods could lead to an unexpected behavior because MUI library requires consistency between options and value. In order to manually to control the input, a ref is exposed which allows to mutually modify input value and form value.
  2. `inputRef` is exposed to clear, reset or set new selected options, as mentioned in point 1.
  3. `defaultSelected` options is still needed as in previous version.
  4. No `invalidErrorMessage` anymore. In case of unmatched input-text, the current form value is maintained.
  5. Use `autoSelect` (combined with `autoHighlight`, already active by default) to auto select a matched option.
  6. The component has MUI style by default. Use `useBootstrapStyle` for applying a "bootstrap-like" style.
  7. `onInputChange` exposes the reason why the input-text changes. Check whether reason is `input` for checking only the typing event.

- :boom: `StaticTypeAheadInput` based on MUI Autocomplete component.

  1. The component is fully **form** controlled.
  2. In order to control input value, use form methods being sure to be consistent between the set value and available options. Therefore, any input ref is exposed anymore.
  3. No need to specify a `defaultSelected` option according to point 1. The input automatically select options based on form value.
  4. No `invalidErrorMessage` anymore. In case of unmatched input-text, the current form value is maintained.
  5. Use `autoSelect` (combined with `autoHighlight`, already active by default) to auto select a matched option.
  6. The component has MUI style by default. Use `useBootstrapStyle` for applying a "bootstrap-like" style.
  7. `onInputChange` exposes the reason why the input-text changes. Check whether reason is `input` for checking only the typing event.

### Added

- `TypeaheadOption` as single option (string or label-value pair).

## [2.14.0] - 2025-02-20

### Added

- `autoComplete` prop to `Input` component

## [2.13.1] - 2024-12-02

### Fixed

- pick disabled options on Tab, updating react-bootstrap-typeahead to v6.3.4.

### dependabot: \#114 Bump the github-actions group with 3 updates

## [2.13.0] - 2024-10-16

### Added

- Added the pkg.pr.new workflow
- The minLength and maxLength input properties

## [2.12.0] - 2024-10-07

### Added

- The property `group` in the `LabelValueOption`
- The possibility to group results both in the `AsyncTypeaheadInput` and `StaticTypeaheadInput` using the property `useGroupBy`

## [2.11.0] - 2024-10-04

### Added

- The property `inputRef` to the `AsyncTypeaheadInput` and exposed `onInputChange` on `StaticTypeaheadInput` and `AsyncTypeaheadInput`

## [2.10.0] - 2024-09-27

### Added

- The property `inputRef` to the `StaticTypeaheadInput`

## [2.9.0] - 2024-09-24

### Added

- Possibility to hide all validation messages through the `hideValidationMessages` form property or field by field by `hideValidationMessage` inputs property

### Fixed

- Form feedback for `TypeaheadInput` components and `DatePickerInput` was not highlighting the input

## [2.8.1] - 2024-09-13

### Fixed

- Selecting an option in a single typeahead shows no invalid state anymore

## [2.8.0] - 2024-09-10

### Fixed

- Autoselect of single available option for `TypeaheadInput` components

## [2.7.0] - 2024-02-28

### Changed

- `requiredFields` prop type from `(keyof T)[]` to `FieldPath<T>[]`
- use "POST" as form method and add additional call to event.preventDefault to prevent a native submit

## [2.6.0] - 2024-02-13

### Changed

- `name` prop type from `keyof T` to `FieldPath<T>`

## [2.5.0] - 2023-12-21

### Added

- Added `innerRef` property to `Input` component

## [2.4.0] - 2023-12-18

### Added

- Added `step` property to `Input` component

## [2.3.0] - 2023-12-12

### Added

- Added `emptyLabel` property to `TypeaheadInput` components
- Added `placeholder` property to `TypeaheadInput` components

## [2.2.2] - 2023-12-01

### Added

- Added `autoComplete` property ("off" as default) in `<DatePickerInput />` component

## [2.2.1] - 2023-10-27

### Changed

- Renamed `ref` to `formRef` in order to let React assign correctly the value

## [2.2.0] - 2023-10-27

### Added

- exposed `form` ref

## [2.1.0] - 2023-10-05

### Added

- `addonLeft` and `addonRight` props now also accept a function to render a custom component

### Fixed

- Export `FormMethods` type

## [2.0.0] - 2023-09-27

### Changed

- :boom: Merged `useInternalFormContext` and `react-hook-form context` in the same `useFormContext` context

## [1.6.0] - 2023-09-25

### Added

- Added support to have undefined values in a select input by using a magic guid value
- `datePickerRef` ref prop to `DatePickerInput`

## [1.5.0] - 2023-09-18

### Added

- Added `disabled` property to disable all inputs in the form

### Changed

- Exports `useInternalFormContext` and its properties through children function params

### dependabot: \#71 Bump tj-actions/changed-files from 38 to 39

### dependabot: \#65 Bump tj-actions/changed-files from 37 to 38

### dependabot: \#69 Bump actions/checkout from 3 to 4

### dependabot: \#70 Bump tibdex/github-app-token from 1 to 2

## [1.4.0] - 2023-09-11

### Added

- Added `disabled` and `selected` to `LabelValueOption` and select inputs

## [1.3.3] - 2023-08-30

### Fixed

- `className` property applied also to `FormattedInput`

## [1.3.2] - 2023-08-24

### Fixed

- Reexporting `useFormContext` from `react-hook-form` to avoid SSR issues

## [1.3.1] - 2023-08-22

### Fixed

- `style` property applied also to `FormattedInput`

### Added

- Added `styles.css` to the export in the package.json

## [1.3.0] - 2023-08-04

### Changed

- Changed peerDependencies notation to support specific major versions

### Fixed

- Fixed export for CommonJS

## [1.2.0] - 2023-07-26

### Added

- `inputGroupStyle` property to `CommonInputProps` in order to customize input group

## [1.1.2] - 2023-07-24

- Fixed checkbox/radio label spacing due to `addonLeft` and `addonRight` props

## [1.1.1] - 2023-07-20

### Fixed

- `is-invalid` added to invalid input groups to show form feedback

## [1.1.0] - 2023-07-20

### dependabot: \#57 Bump word-wrap from 1.2.3 to 1.2.4 in /cypress

### dependabot: \#56 Bump word-wrap from 1.2.3 to 1.2.4

### Fixed

- moved `rollup-plugin-import-css` from `dependencies` to `devDependencies`
- `InputField` is marked invalid also for nested fields

### Added

- `style` and `classname` properties to `CommonInputProps` in order to customize input fields

## [1.0.1] - 2023-07-18

### Changed

- :boom: `DatePickerInput` by default now uses the browser timezone
- :boom: `setUtcTimeToZero` changed to `getUtcTimeZeroDate` which returns a new date instead of modifying the passed one

### Added

- `DatePickerInput` now supports `ianaTimeZone` property to set the timezone of the date picker

### Fixed

- `DatePickerInput` is not setting the time to utc zero anymore if it's not a date only picker

## [1.0.0] - 2023-10-18

:warning: Missing release because of a bug on npmjs.com. Releasing 1.0.1 instead.

## [0.16.2] - 2023-07-18

### dependabot: \#52 Bump semver from 6.3.0 to 6.3.1 in /cypress

### dependabot: \#51 Bump semver from 5.7.1 to 5.7.2

## [0.16.1] - 2023-06-26

### dependabot: \#48 Bump tj-actions/changed-files from 36 to 37

## [0.16.0] - 2023-06-07

### dependabot: \#43 Bump vm2 from 3.9.17 to 3.9.19

### Added

- `addonLeft` and `addonRight` properties to pass a ReactNode to be shown on the left/right of the inputfield in a reactstrap InputGroup

## [0.15.0] - 2023-05-25

### Added

- `markAllOnFocus` property to make an inputfield mark the inner text by getting the focus

## [0.14.0] - 2023-05-24

### Added

- `inputOnly` property to only get the inputfield not nested in other elements

## [0.13.0] - 2023-05-15

### Changed

- Labels are now optional for all input fields

## [0.12.0] - 2023-05-15

### Added

- `autoSubmitConfig` property to make a form submit automatically with a delay in MS after every change

## [0.11.1] - 2023-05-12

### Fixed

- Changed the default for the InternalFormContext to be a suitable default instead of null

## [0.11.0] - 2023-05-10

### Added

- `requiredFields` property names array used to just mark label of required fields with `*` character

## [0.10.1] - 2023-05-08

### Changed

- Changed from `microbundle` to `rollup` for building the package
- Updated all the dependencies to the latest version

### Fixed

- Fixed `useFormContext` that returned null on server side.

## [0.10.0] - 2023-04-27

### Added

- `placeholder` property to set `placeholder` in `<Input />` components

### Security

- Dependabot: Bump vm2 from 3.9.16 to 3.9.17

## [0.9.0] - 2023-04-20

### Security

- Dependabot: Bumps vm2 from 3.9.11 to 3.9.16.

### Added

- `plainText` property to set `plaintext` in `<Input />` components

## [0.8.1] - 2023-04-06

### Fixed

- Support for showing errors of nested fields

## [0.8.0] - 2023-04-04

### Changed

- Property `onChange` in order to handle final select value for the `StaticTypeaheadInput` and `AsyncTypeaheadInput` components

### Security

- Dependabot: Bump webpack from 5.75.0 to 5.76.0
- Dependabot: Bump cacheable-request from 10.2.3 to 10.2.7
- Dependabot: Bump saadmk11/github-actions-version-updater from 0.7.3 to 0.7.4

## [0.7.0] - 2023-03-09

### Added

- Exposing the `props` from the `react-bootstrap-typeahead` package to the `StaticTypeaheadInput` and `AsyncTypeaheadInput` components

## [0.6.0] - 2023-03-09

### Added

- `textAreaRows` property to set `rows` in `<Input type="textarea" />` components

### Changed

- Text area test to check the new `textAreaRows` property

## [0.5.1] - 2023-02-07

### Added

- Support for iso strings as default values for the `Form` component

### Changed

- Fixed `DatePickerInput` issues
- Dependabot: Bump http-cache-semantics from 4.1.0 to 4.1.1

## [0.5.0] - 2023-01-25

### Added

- Added the ability to pass default selected options to the `StaticTypeaheadInput` and `AsyncTypeaheadInput` components

## [0.4.0] - 2023-01-23

### Added

- `labelToolTip` property to components sharing `FormGroupLayout`.
- cypress tests for components implementing new `labelToolTip` property.

### Changed

- Dependabot: Bump json5 from 1.0.1 to 1.0.2
- Changed `label` property of `FormGroupLayout` from `string` to `ReactNode`

## [0.3.0] - 2023-01-12

### Added

- `disabled` property to components sharing `CommonInputProps`.
- cypress tests for components implementing new `disabled` property.

### Changed

- Dependabot: Bump decode-uri-component from 0.2.0 to 0.2.2

## [0.2.0] - 2022-11-28

### Changed

- Dependabot: Bump loader-utils from 1.4.1 to 1.4.2
- Fixed a warning that was being thrown because of the switch layout
- Renamed `inputType` to `type`

### Added

- Added the possibility to pass a function to the `Form` component to allow accessing the form methods

## [0.1.2] - 2022-11-24

### Changed

- Fixed readme section on how to install the package

## [0.1.1] - 2022-11-23

### Changed

- Corrected package description

## [0.1.0] - 2022-11-23

### Added

- Created package :tada:

[unreleased]: https://github.com/neolution-ch/react-hook-form-components/compare/3.9.0...HEAD
[0.1.2]: https://github.com/neolution-ch/react-hook-form-components/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/neolution-ch/react-hook-form-components/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/neolution-ch/react-hook-form-components/releases/tag/0.1.0
[0.16.2]: https://github.com/neolution-ch/react-hook-form-components/compare/0.16.1...0.16.2
[0.16.1]: https://github.com/neolution-ch/react-hook-form-components/compare/0.16.0...0.16.1
[0.16.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.15.0...0.16.0
[0.15.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.14.0...0.15.0
[0.14.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.13.0...0.14.0
[0.13.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.12.0...0.13.0
[0.12.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.11.1...0.12.0
[0.11.1]: https://github.com/neolution-ch/react-hook-form-components/compare/0.11.0...0.11.1
[0.11.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.10.1...0.11.0
[0.10.1]: https://github.com/neolution-ch/react-hook-form-components/compare/0.10.0...0.10.1
[0.10.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.9.0...0.10.0
[0.9.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.8.1...0.9.0
[0.8.1]: https://github.com/neolution-ch/react-hook-form-components/compare/0.8.0...0.8.1
[0.8.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.7.0...0.8.0
[0.7.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.6.0...0.7.0
[0.6.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.5.1...0.6.0
[0.5.1]: https://github.com/neolution-ch/react-hook-form-components/compare/0.5.0...0.5.1
[0.5.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.4.0...0.5.0
[0.4.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/neolution-ch/react-hook-form-components/releases/tag/0.2.0
[3.9.0]: https://github.com/neolution-ch/react-hook-form-components/compare/3.8.0...3.9.0
[3.8.0]: https://github.com/neolution-ch/react-hook-form-components/compare/3.7.1...3.8.0
[3.7.1]: https://github.com/neolution-ch/react-hook-form-components/compare/3.7.0...3.7.1
[3.7.0]: https://github.com/neolution-ch/react-hook-form-components/compare/3.6.1...3.7.0
[3.6.1]: https://github.com/neolution-ch/react-hook-form-components/compare/3.6.0...3.6.1
[3.6.0]: https://github.com/neolution-ch/react-hook-form-components/compare/3.5.0...3.6.0
[3.5.0]: https://github.com/neolution-ch/react-hook-form-components/compare/3.4.0...3.5.0
[3.4.0]: https://github.com/neolution-ch/react-hook-form-components/compare/3.3.0...3.4.0
[3.3.0]: https://github.com/neolution-ch/react-hook-form-components/compare/3.2.0...3.3.0
[3.2.0]: https://github.com/neolution-ch/react-hook-form-components/compare/3.1.1...3.2.0
[3.1.1]: https://github.com/neolution-ch/react-hook-form-components/compare/3.1.0...3.1.1
[3.1.0]: https://github.com/neolution-ch/react-hook-form-components/compare/3.0.1...3.1.0
[3.0.1]: https://github.com/neolution-ch/react-hook-form-components/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.14.0...3.0.0
[2.14.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.13.1...2.14.0
[2.13.1]: https://github.com/neolution-ch/react-hook-form-components/compare/2.13.0...2.13.1
[2.13.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.12.0...2.13.0
[2.12.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.11.0...2.12.0
[2.11.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.10.0...2.11.0
[2.10.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.9.0...2.10.0
[2.9.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.8.1...2.9.0
[2.8.1]: https://github.com/neolution-ch/react-hook-form-components/compare/2.8.0...2.8.1
[2.8.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.7.0...2.8.0
[2.7.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.6.0...2.7.0
[2.6.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.5.0...2.6.0
[2.5.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.4.0...2.5.0
[2.4.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.3.0...2.4.0
[2.3.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.2.2...2.3.0
[2.2.2]: https://github.com/neolution-ch/react-hook-form-components/compare/2.2.1...2.2.2
[2.2.1]: https://github.com/neolution-ch/react-hook-form-components/compare/2.2.0...2.2.1
[2.2.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.1.0...2.2.0
[2.1.0]: https://github.com/neolution-ch/react-hook-form-components/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/neolution-ch/react-hook-form-components/compare/1.6.0...2.0.0
[1.6.0]: https://github.com/neolution-ch/react-hook-form-components/compare/1.5.0...1.6.0
[1.5.0]: https://github.com/neolution-ch/react-hook-form-components/compare/1.4.0...1.5.0
[1.4.0]: https://github.com/neolution-ch/react-hook-form-components/compare/1.3.3...1.4.0
[1.3.3]: https://github.com/neolution-ch/react-hook-form-components/compare/1.3.2...1.3.3
[1.3.2]: https://github.com/neolution-ch/react-hook-form-components/compare/1.3.1...1.3.2
[1.3.1]: https://github.com/neolution-ch/react-hook-form-components/compare/1.3.0...1.3.1
[1.3.0]: https://github.com/neolution-ch/react-hook-form-components/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/neolution-ch/react-hook-form-components/compare/1.1.2...1.2.0
[1.1.2]: https://github.com/neolution-ch/react-hook-form-components/compare/1.1.1...1.1.2
[1.1.1]: https://github.com/neolution-ch/react-hook-form-components/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/neolution-ch/react-hook-form-components/compare/1.0.1...1.1.0
[1.0.1]: https://github.com/neolution-ch/react-hook-form-components/compare/0.16.2...1.0.1
