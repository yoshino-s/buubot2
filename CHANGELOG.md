# Changelog


## [2.1.0](https://github.com/Yoshino-s/buubot2/compare/v2.0.0...v2.1.0) (2020-09-26)


### Features

* **mirai:** update mirai & reconstrcut project structure ([5c63883](https://github.com/Yoshino-s/buubot2/commit/5c63883778dc9587f576fe7de4af725a72cf3512))


### Bug Fixes

* **bot:** fix bot structure ([b1f31c7](https://github.com/Yoshino-s/buubot2/commit/b1f31c75784571f3aaf3c52289a9b75d53e04dea))

## [2.0.0](https://github.com/Yoshino-s/buubot2/compare/v1.0.3...v2.0.0) (2020-09-07)


### Features

* **ban:** add banner plugin ([86ea107](https://github.com/Yoshino-s/buubot2/commit/86ea1074edc768c2fa78fe8f2bd157fd52d01e57))
* **cmd prefix:** allow set multiple command prefix ([eb15e2f](https://github.com/Yoshino-s/buubot2/commit/eb15e2f04249ddaa0cf693890ff15b0c839ca4a9))
* **ctfer:** add ctfer cmd ([489bcfd](https://github.com/Yoshino-s/buubot2/commit/489bcfd15617b4fe12d5ee4ecab70703c49d83fa))
* **decorator:** use decorator to reconstruct plugin ([7b71d3e](https://github.com/Yoshino-s/buubot2/commit/7b71d3e162b0a473f87eb56ea626897755e15978))
* **greet:** add greet plugin ([0c73ca9](https://github.com/Yoshino-s/buubot2/commit/0c73ca9c4a7dfab40ddb399972b3a4a9671f459b))
* **search:** add search plugin ([8c3a084](https://github.com/Yoshino-s/buubot2/commit/8c3a0848d17ee980f553b43abbf7a750afe99250))
* **setu:** add data ([0b04b20](https://github.com/Yoshino-s/buubot2/commit/0b04b20501aa0ef2f44ae01410e635654f51f284))
* **setu:** add hide api ([c4212bc](https://github.com/Yoshino-s/buubot2/commit/c4212bc7b4bd274d871a9704f2cfaf0047a52e4a))
* **web:** add web page of bot ([f89b8e1](https://github.com/Yoshino-s/buubot2/commit/f89b8e1899cd41e7634e19bffd9bf10d8d7363a1))


### Bug Fixes

* **ban:** add recall msg ([f49adae](https://github.com/Yoshino-s/buubot2/commit/f49adaeb936edec1c6077c5cb51f4a04d2479f3b))
* **ban:** fix ban ([178c0d4](https://github.com/Yoshino-s/buubot2/commit/178c0d4f9586e5405578aa68b8e9ddd0343351df))
* **banner&groupcmd:** fix some bug ([9851057](https://github.com/Yoshino-s/buubot2/commit/9851057d5a4b308df9477e2bbff5ae8a1b7f335d))
* **config:** fix a bug in config.js ([d2c1a77](https://github.com/Yoshino-s/buubot2/commit/d2c1a77f537fe0c95a973a1f7f689a45cf95a10b))
* **config:** fix one more bug in config.js ([c542c89](https://github.com/Yoshino-s/buubot2/commit/c542c892cdd9dea13c24d6545e36ef6821c0f4c7))
* **dependencies:** fix wrong dep ([47bd774](https://github.com/Yoshino-s/buubot2/commit/47bd7748272b50b1795725d38f26a048865d190b))
* **ncc:** fix a bug with ncc and bull ([c9996ec](https://github.com/Yoshino-s/buubot2/commit/c9996eca5d832ac3fa098f5fcbb5a854e6edcd2d))
* **prefix:** fix bug of last commit ([6c1e136](https://github.com/Yoshino-s/buubot2/commit/6c1e13676663e3e041c6f9c61ad3c3155844abc5))
* **search:** move proxy to cloudflare ([b0d2a33](https://github.com/Yoshino-s/buubot2/commit/b0d2a33457fa1872792b1d42cb41bfaba8199e54))
* **setu:** fix a tiny bug ([0a2cd66](https://github.com/Yoshino-s/buubot2/commit/0a2cd668fa583ee4c38de67f7b12408ecda43975))
* **setu:** fix font issue ([b45d94e](https://github.com/Yoshino-s/buubot2/commit/b45d94e45cc0e656a5e15c497662879b26e854ac))
* **storage:** fix bug ([4e6fbc6](https://github.com/Yoshino-s/buubot2/commit/4e6fbc6300a24c84ae08000fe2cea59f83749782))
* **web:** move fastify to express due to some problems ([9313dce](https://github.com/Yoshino-s/buubot2/commit/9313dce625d5427ffeb6d1a89b38327dd6c9079d))

### [1.0.3](https://github.com/Yoshino-s/buubot2/compare/v1.0.2...v1.0.3) (2020-08-10)


### ⚠ BREAKING CHANGES

* **global:** Remove greet and monitor plugins, add redis dependent

### Features

* **greet:** add greet plugin ([2d729dc](https://github.com/Yoshino-s/buubot2/commit/2d729dc13dea59cc059ffc144f23945ca2b2b724))
* **group cmd ctl:** add mute cmd ([685dd81](https://github.com/Yoshino-s/buubot2/commit/685dd81cce1f3c5d8d813bcb5f2c2cf9b591901c))
* **random image:** move to cloudflare server ([087b5c5](https://github.com/Yoshino-s/buubot2/commit/087b5c5b118fc67e048c7c72204d3271d2627b34))
* **recall & flash image:** prevent recall important msg and flash iamge ([bb20dd8](https://github.com/Yoshino-s/buubot2/commit/bb20dd8e571fb050989865541d8c54dedfeb9d96))
* **sucker:** move source to self-hosted hitokoto ([8656416](https://github.com/Yoshino-s/buubot2/commit/865641699e7a6e1dbe37de122269c40f1d71bd24))


### Bug Fixes

* **config:** fix wrong config ([262446e](https://github.com/Yoshino-s/buubot2/commit/262446e03641382d1332663c1f107f7433f21934))
* **global:** fix many bugs ([ac929a4](https://github.com/Yoshino-s/buubot2/commit/ac929a48b7a5514875da2b350e460cb15a13ee2b))
* **greet:** change cmd ([e21e99a](https://github.com/Yoshino-s/buubot2/commit/e21e99a5866128b86f41f87c7f08805c26d7f7f5))
* **greet:** fix greet cmd ([0c05301](https://github.com/Yoshino-s/buubot2/commit/0c0530179e4918c8cab0367eb08106d24d526144))
* **greet:** fix sendAll ([0f95c90](https://github.com/Yoshino-s/buubot2/commit/0f95c900ce97d1f040d12d29b9b30888a9ded568))
* **repeater:** fix the calculation of similarity ([749e627](https://github.com/Yoshino-s/buubot2/commit/749e627509757ebfaa39b73bfa88033d317967f3))
* **sucker:** add max_length ([364acaf](https://github.com/Yoshino-s/buubot2/commit/364acaf8623ff22afb5c4cc850fc2056bb3fd843))
* **sucker:** fix encode type ([4f14bad](https://github.com/Yoshino-s/buubot2/commit/4f14badaf798faf7bbeef75655287030e07ab9b9))
* **unserialize:** froce stringify ([4f7648a](https://github.com/Yoshino-s/buubot2/commit/4f7648a9027444a39748befd473a90e89ae81d84))
* **utils:** fix sendAll ([52d4bb8](https://github.com/Yoshino-s/buubot2/commit/52d4bb8cc0ca1ea07b6742d22de440da7f5ff369))

### [1.0.2](https://github.com/Yoshino-s/buubot2/compare/v1.0.1...v1.0.2) (2020-07-17)


### Features

* **config:** change config format ([0121634](https://github.com/Yoshino-s/buubot2/commit/0121634596c96161c3f1bd030be11787b4060922))
* **monitor:** add npm advisories monitor ([fda387f](https://github.com/Yoshino-s/buubot2/commit/fda387f3dbd989580570cf5b4e6f51e86c760822))
* **monitor:** fix msg format ([4e2879a](https://github.com/Yoshino-s/buubot2/commit/4e2879a792d6c978d5961fcd371b268de9a41e5d))
* **permission:** build a more specific permission control ([16914b4](https://github.com/Yoshino-s/buubot2/commit/16914b42b83453473923f95adfc6dfbece155556))


### Bug Fixes

* **data storage:** move all data to one folder ([74c362f](https://github.com/Yoshino-s/buubot2/commit/74c362f4f793093f1c6a4a24465836605383f9e9))
* **gitignore:** add data to gitignore ([27d3385](https://github.com/Yoshino-s/buubot2/commit/27d3385d5cbf49ab8b6fa8ed202209675f672d3f))
* **monitor:** change interval ([3403a16](https://github.com/Yoshino-s/buubot2/commit/3403a16177a693561cb6724113628d97f9f5bb0d))
* **repeater:** fix repeater on image ([091daa1](https://github.com/Yoshino-s/buubot2/commit/091daa1fd18932f027abbf2373cd0fc4ae7fe173))

### 1.0.1 (2020-07-16)


### Features

* **git:** add git tool ([0546377](https://github.com/Yoshino-s/buubot2/commit/0546377d51f1558a9215cadb3c2d3b1a3c8e8835))
