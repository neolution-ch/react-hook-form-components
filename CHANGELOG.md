# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[unreleased]: https://github.com/neolution-ch/react-hook-form-components/compare/0.16.0...HEAD
[0.1.2]: https://github.com/neolution-ch/react-hook-form-components/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/neolution-ch/react-hook-form-components/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/neolution-ch/react-hook-form-components/releases/tag/0.1.0
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
