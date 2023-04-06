# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Support for showing errors in child objects

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

[unreleased]: https://github.com/neolution-ch/react-hook-form-components/compare/0.8.0...HEAD
[0.1.2]: https://github.com/neolution-ch/react-hook-form-components/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/neolution-ch/react-hook-form-components/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/neolution-ch/react-hook-form-components/releases/tag/0.1.0
[0.8.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.7.0...0.8.0
[0.7.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.6.0...0.7.0
[0.6.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.5.1...0.6.0
[0.5.1]: https://github.com/neolution-ch/react-hook-form-components/compare/0.5.0...0.5.1
[0.5.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.4.0...0.5.0
[0.4.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/neolution-ch/react-hook-form-components/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/neolution-ch/react-hook-form-components/releases/tag/0.2.0
