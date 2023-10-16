import React, { useEffect } from 'react';
import { sound } from '@pixi/sound';
import { useNavigate } from 'react-router-dom'
import { IReel } from '../@types';
import { PIXI, app, appStage, Global_Store } from '../renderer';
import { loop } from '../system';
import keyboard from '../utils/keyboard';
import { getInfoMask, getReelContainerMask } from '../utils/mask';
import { assetUrls, backout, lerp, show_dialog, slotAnimateUrls, tweenTo, tweening } from '../utils/urls';
import { getInputSprite } from '../utils/input';
import { bubble_animate, calculateScale, fire_animate, gen_autospin_item, gen_card_animated_sprite, pay_table, sleep } from '../utils/utils';
import { getSliderSprite } from '../utils/slider';
import { getCheckSprite } from '../utils/check';
import { App_Dimension, winTextStyle } from '../config';
import { pay_elems } from '../config/pay';

const critical_ratio = 0.75
let auto_spin_val = 0
let prev_won_line_index = -1
let won_lines:
  Array<{
    won_line_number_arr: Array<number>,
    multiply_val: number,
    pay_line_id: number,
    cur_win: number
  }> = []
let last_win = 0
let cur_bet_val = 0;
const GamePIXI = () => {
  useEffect(() => {
    if (Global_Store.loaded) {
      // onAssetsLoaded()
    } else {
      PIXI.Assets.load(assetUrls)
        // .then(() => {
        //   appStage.alpha = 0
        //   return new Promise((resolve) => {
        //     setTimeout(() => resolve("Go"), 100);
        //   });
        // })
        .then(onAssetsLoaded);
    }
  }, [])
  const navigate = useNavigate()
  async function onAssetsLoaded() {
    Global_Store.loaded = true;
    // tweenTo(appStage, 'alpha', 0, 1, 1000, backout(1), null, null)
    appStage.removeChildren();





    const gameBoardSprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/background.png'))
    // gameBoardSprite.position.set(-100, 0)
    appStage.addChild(gameBoardSprite);

    const backgroundFooterSprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/background-footer.png'))
    // backgroundFooterSprite.anchor.set(100 / backgroundFooterSprite.width, 0)
    app.stage.addChild(backgroundFooterSprite);

    const mobile_win_hold_spin_text_wrapper = new PIXI.Container()
    mobile_win_hold_spin_text_wrapper.scale.set(2)


    const bet_text = new PIXI.Text('100', { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff });
    const bet_text_static = new PIXI.Text('BET', { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff });
    const total_bet_text = new PIXI.Text('100', { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff });
    const total_bet_text_static = new PIXI.Text('Total bet', { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff });
    const win_hold_spin_text = new PIXI.Text('Hold spin to quick spins', { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff });
    const mobile_win_hold_spin_text_upper = new PIXI.Text('Hold spin', { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff });
    const mobile_win_hold_spin_text_down = new PIXI.Text('', { fontFamily: 'Arial', fontSize: 32, fill: 0xf7d245 });
    const balance_text_static = new PIXI.Text('Balance', { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff });
    const balance_text = new PIXI.Text('100000', { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff });
    backgroundFooterSprite.addChild(bet_text_static)
    backgroundFooterSprite.addChild(bet_text)
    backgroundFooterSprite.addChild(balance_text_static)
    backgroundFooterSprite.addChild(balance_text)
    backgroundFooterSprite.addChild(total_bet_text)
    backgroundFooterSprite.addChild(total_bet_text_static)
    backgroundFooterSprite.addChild(win_hold_spin_text)
    backgroundFooterSprite.addChild(mobile_win_hold_spin_text_wrapper)
    const bg_mobile_win_hold_spin_text = new PIXI.Graphics()
    mobile_win_hold_spin_text_wrapper.addChild(bg_mobile_win_hold_spin_text)
    mobile_win_hold_spin_text_wrapper.addChild(mobile_win_hold_spin_text_upper)
    mobile_win_hold_spin_text_wrapper.addChild(mobile_win_hold_spin_text_down)

    balance_text_static.anchor.set(0.5)
    bet_text_static.anchor.set(0.5)
    bet_text.anchor.set(0.5)
    win_hold_spin_text.anchor.set(0.5)
    total_bet_text.anchor.set(0.5)
    total_bet_text_static.anchor.set(0.5)
    win_hold_spin_text.position.set(1200, 40)
    win_hold_spin_text.scale.set(1)
    mobile_win_hold_spin_text_upper.anchor.set(0.5)
    mobile_win_hold_spin_text_upper.position.set(100, 30)
    mobile_win_hold_spin_text_down.anchor.set(0.5)
    mobile_win_hold_spin_text_down.position.set(100, 70)
    bg_mobile_win_hold_spin_text.lineStyle(0);
    bg_mobile_win_hold_spin_text.beginFill(0xffffff)
      .drawRoundedRect(-2, -2, 204, 104, 17)
    bg_mobile_win_hold_spin_text.beginFill(0x222222)
      .drawRoundedRect(0, 0, 200, 100, 15)


    const mobile_background_footer_sprite = new PIXI.Container()
    const mobile_background_header_sprite = new PIXI.Container()
    app.stage.addChild(mobile_background_header_sprite);
    app.stage.addChild(mobile_background_footer_sprite);
    const button_mobile_A = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-mobile-A.png'))
    const button_mobile_chip = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-mobile-chip.png'))
    const button_mobile_H = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-mobile-H.png'))
    const button_mobile_i = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-mobile-i.png'))
    const button_mobile_reload = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-mobile-reload.png'))
    const button_mobile_setting = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-mobile-setting.png'))
    const button_mobile_wallet = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-mobile-wallet.png'))
    mobile_background_header_sprite.addChild(button_mobile_i)
    mobile_background_header_sprite.addChild(button_mobile_wallet)
    button_mobile_wallet.position.set(50, 50)
    button_mobile_i.position.set(625, 50)

    mobile_background_footer_sprite.addChild(button_mobile_setting)
    mobile_background_footer_sprite.addChild(button_mobile_A)
    mobile_background_footer_sprite.addChild(button_mobile_reload)
    mobile_background_footer_sprite.addChild(button_mobile_chip)
    mobile_background_footer_sprite.addChild(button_mobile_H)
    button_mobile_A.position.set(150, 0)
    button_mobile_reload.position.set(280, -30)
    button_mobile_chip.position.set(475, 0)
    button_mobile_H.position.set(625, 0)
    // !button_mobile_event_listeners
    button_mobile_reload.eventMode = button_mobile_wallet.eventMode = button_mobile_i.eventMode = button_mobile_setting.eventMode = button_mobile_chip.eventMode = button_mobile_H.eventMode = button_mobile_A.eventMode = 'static';
    button_mobile_reload.cursor = button_mobile_wallet.cursor = button_mobile_i.cursor = button_mobile_setting.cursor = button_mobile_chip.cursor = button_mobile_H.cursor = button_mobile_A.cursor = 'pointer';
    button_mobile_reload.on('pointerdown', () => {
      startPlay()
    })
    button_mobile_i.on('pointerdown', () => {
      info_content_sprite.texture = PIXI.Texture.from('/assets/image/info-content.png')
      display_win_text.alpha = 0
      show_dialog(info_dialog_wrapper, close_button_sprite)
    })
    button_mobile_wallet.on('pointerdown', () => {
      navigate('/show-history')
    })
    button_mobile_setting.on('pointerdown', () => {
      setting_sprite_on_pointerdown()
    })
    button_mobile_chip.on('pointerdown', () => {
      button_bet_sprite_on_pointerdown()
    })
    button_mobile_H.on('pointerdown', () => {
      button_bline_sprite_on_pointerdown()
    })
    button_mobile_A.on('pointerdown', () => {
      button_auto_spin_sprite_on_pointerdown()
    })
    // !button_mobile_event_listeners
    fire_animate()
    bubble_animate()

    const reelContainer = new PIXI.Container();
    reelContainer.scale.set(0.88)
    reelContainer.position.set(380, -100)
    const reelContainerMask = getReelContainerMask()
    reelContainer.addChild(reelContainerMask)
    reelContainer.mask = (reelContainerMask)


    const reels: IReel[] = []

    for (let i = 0; i < 5; i++) {
      const reel = new PIXI.Container();
      reel.x = i * 265
      const animated_symbols: PIXI.Container[] = []
      const cards: PIXI.Container[] = []
      const card_backs: PIXI.Sprite[] = []
      const url_ids: number[] = []
      const reelItem = {
        reel,
        animated_symbols,
        card_backs,
        cards,
        url_ids,
        position: 0,
        previousPosition: 0,
        blur: new PIXI.BlurFilter(),
      }
      for (let j = 0; j < 4; j++) {
        const cardSprite = new PIXI.Container();
        const cardBackSprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/card-back.png'))
        let url_id = Math.floor(Math.random() * slotAnimateUrls.length)
        let compens_arr: number[] = []
        if (i == 0) compens_arr = [1, 2]
        if (i == 1 || i == 4) compens_arr = [0, 1, 2]
        while (compens_arr.includes(url_id)) url_id = Math.floor(Math.random() * slotAnimateUrls.length)
        const cardSymbolWrapperSprite = new PIXI.Container()
        const cardSymbolSprite = gen_card_animated_sprite(slotAnimateUrls[url_id])
        cardSymbolWrapperSprite.addChild(cardSymbolSprite)
        cardSymbolWrapperSprite.position.set(10, 0)
        cardSprite.addChild(cardBackSprite)
        card_backs.push(cardBackSprite)
        cardSprite.addChild(cardSymbolWrapperSprite)
        cardSprite.y = App_Dimension.cardHeight * j
        reel.addChild(cardSprite)
        reelItem.animated_symbols.push(cardSymbolWrapperSprite)
        reelItem.url_ids.push(url_id)
        reelItem.cards.push(cardSprite)
      }
      reels.push(reelItem)
      reelContainer.addChild(reel)
      reelItem.blur.blurX = 0;
      reelItem.blur.blurY = 0;
      reel.filters = [reelItem.blur]
    }
    appStage.addChild(reelContainer)

    const testContainerSprite = new PIXI.Container();
    appStage.addChild(testContainerSprite)



    const info_dialog_wrapper = new PIXI.Container()
    info_dialog_wrapper.alpha = 0
    const scroll_bar_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/scroll-bar.png'))
    const close_button_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-close.png'))
    const info_bg_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/info-bg.png'))



    const info_bg_sprite_back = new PIXI.Graphics()
    info_bg_sprite.addChild(info_bg_sprite_back)
    info_bg_sprite_back.lineStyle(0);
    info_bg_sprite_back.beginFill(0x222222, 1).drawRect(-2000, -1000, 8000, 20000);







    const info_content_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/info-content.png'))
    const info_bg_sprite_mask = getInfoMask()
    // info_content_sprite.mask = info_bg_sprite_mask
    info_dialog_wrapper.addChild(info_bg_sprite)
    info_dialog_wrapper.addChild(info_content_sprite)
    // info_dialog_wrapper.addChild(info_bg_sprite_mask)
    info_dialog_wrapper.addChild(scroll_bar_sprite)
    info_dialog_wrapper.addChild(close_button_sprite)
    const setting_footer_sprite = new PIXI.Graphics()
    setting_footer_sprite.filters = [new PIXI.BlurFilter(10, 10)]
    // info_dialog_wrapper.addChild(setting_footer_sprite)
    setting_footer_sprite.lineStyle(0);
    setting_footer_sprite.beginFill(0x222222, 1).drawRect(0, 850, 1920, 150);



    const scroll_bar_init_y = 150
    const scroll_bar_end_y = 800
    close_button_sprite.position.set(1590, 80)
    close_button_sprite.eventMode = 'none';
    close_button_sprite.cursor = 'pointer';
    close_button_sprite.on('pointerdown', () => {
      tweenTo(info_dialog_wrapper, 'alpha', 1, 0, 500, backout(1), null, null)
      close_button_sprite.eventMode = 'none';
    })
    scroll_bar_sprite.position.set(1600, scroll_bar_init_y)

    app.stage.addChild(info_dialog_wrapper);
    // info_dialog_wrapper.width = 1920;
    // info_dialog_wrapper.height = 3470;
    // const scrollBox = new ScrollBox({
    //   background: 0XFFFFFF,
    //   width: 1920,
    //   height: 3470,
    //   items: [
    //     info_dialog_wrapper
    //   ],
    // });
    // appStage.addChild(scrollBox);
    function handleMouseWheel(e: WheelEvent) {
      const deltaY = e.deltaY;
      info_content_sprite.y -= deltaY * 0.5;
      if (info_content_sprite.y > 0) info_content_sprite.y = 0
      console.log(info_content_sprite.y)
      const info_content_sprite_height = app.screen.width + 500
      if (info_content_sprite.y < -info_content_sprite_height) info_content_sprite.y = -info_content_sprite_height
      scroll_bar_sprite.y = scroll_bar_init_y - (scroll_bar_end_y - scroll_bar_init_y) * info_content_sprite.y / info_content_sprite_height
    }

    app.view.addEventListener("wheel", handleMouseWheel);



    const info_at_statusbarSprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-info-bar-empty.png'))
    info_at_statusbarSprite.position.set(-9, 0)
    const status_bar_wrapper = new PIXI.Container();
    // const info_help_group = new PIXI.Container();
    // info_help_group.scale.set(0)
    // const infoButtonSprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-info.png'))
    // const helpButtonSprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-help.png'))






    // infoButtonSprite.eventMode = 'static';
    // infoButtonSprite.cursor = 'pointer';
    // infoButtonSprite.on('pointerdown', () => {
    //   info_content_sprite.texture = PIXI.Texture.from('/assets/image/info-content.png')
    //   display_win_text.alpha = 0
    //   if (info_dialog_wrapper.alpha === 0) {
    //     tweenTo(info_dialog_wrapper, 'alpha', 0, 1, 500, backout(1), null, null)
    //     close_button_sprite.eventMode = 'static'
    //   }
    // })
    // helpButtonSprite.eventMode = 'static';
    // helpButtonSprite.cursor = 'pointer';
    // helpButtonSprite.on('pointerdown', () => {
    //   display_win_text.alpha = 0
    //   info_content_sprite.texture = PIXI.Texture.from('/assets/image/help-content.png')
    //   if (info_dialog_wrapper.alpha === 0) {
    //     tweenTo(info_dialog_wrapper, 'alpha', 0, 1, 500, backout(1), null, null)
    //     close_button_sprite.eventMode = 'static'
    //   }
    // })
    // helpButtonSprite.position.set(0, 40)
    // info_help_group.addChild(infoButtonSprite)
    // info_help_group.addChild(helpButtonSprite)

    status_bar_wrapper.addChild(info_at_statusbarSprite)
    // status_bar_wrapper.addChild(info_help_group)
    status_bar_wrapper.position.set(225, 10)
    status_bar_wrapper.pivot.set(0, 80)
    backgroundFooterSprite.addChild(status_bar_wrapper)
    info_at_statusbarSprite.eventMode = status_bar_wrapper.eventMode = 'static';
    info_at_statusbarSprite.cursor = 'pointer';
    // status_bar_wrapper.interactive = false
    info_at_statusbarSprite.on('pointerdown', () => {
      info_content_sprite.texture = PIXI.Texture.from('/assets/image/info-content.png')
      display_win_text.alpha = 0
      show_dialog(info_dialog_wrapper, close_button_sprite)
    })
    status_bar_wrapper.on('pointerover', () => {
      info_at_statusbarSprite.texture = PIXI.Texture.from('/assets/image/button-info-bar.png')
      // tweenTo(info_help_group.scale, 'x', 0, 1, 500, backout(1.3), null, null)
      // tweenTo(info_help_group.scale, 'y', 0, 1, 500, backout(1.3), null, null)
    }).on('pointerout', () => {
      info_at_statusbarSprite.texture = PIXI.Texture.from('/assets/image/button-info-bar-empty.png')
      // tweenTo(info_help_group.scale, 'x', 1, 0, 500, backout(1), null, null)
      // tweenTo(info_help_group.scale, 'y', 1, 0, 500, backout(1), null, null)
    })

    const setting_modal_wrapper = new PIXI.Container()
    setting_modal_wrapper.alpha = 0
    setting_modal_wrapper.position.set(2000, -50)
    appStage.addChild(setting_modal_wrapper)
    setting_modal_wrapper.eventMode = 'static';
    const bg_modal_sprite = new PIXI.Graphics()
    bg_modal_sprite.eventMode = 'static'
    bg_modal_sprite.cursor = 'pointer';
    bg_modal_sprite.on('pointerdown', (event) => {
      if (event.target === bg_modal_sprite) {
        tweenTo(setting_modal_wrapper, 'x', 0, 2000, 500, backout(1), null, null);
        tweenTo(setting_modal_wrapper, 'alpha', 1, 0, 500, backout(1), null, null);
      }
    });
    setting_modal_wrapper.addChild(bg_modal_sprite)
    bg_modal_sprite.lineStyle(0);
    bg_modal_sprite.beginFill(0x222222, 0.01).drawRect(0, 0, 1920, 960);




    const setting_modal = new PIXI.Container()
    setting_modal.pivot.set(450, 368)
    // setting_modal.interactiveChildren = false
    setting_modal_wrapper.addChild(setting_modal)



    setting_modal.position.set(950, 468)
    const bg_setting_sprite = new PIXI.Graphics()
    setting_modal.addChild(bg_setting_sprite)
    bg_setting_sprite.lineStyle(0);
    bg_setting_sprite.beginFill(0x222222, 1).drawRect(0, 0, 900, 735);
    // const bet_amount_arr = Array.from({ length: 14 }, (_, index) => (index + 1) * 100);
    let setting_item_text_arr: PIXI.Text[] = []
    for (let amount = 1; amount <= 7; amount++) {
      const { wrapper: input_element_wrapper } = getInputSprite({
        text: String((amount * 2 - 1) * 100), onChange: val => { setting_item_text_arr[(amount - 1) * 2].text = val }
      })
      setting_modal.addChild(input_element_wrapper)
      const { wrapper: input_element_wrapper2 } = getInputSprite({
        text: String(amount * 200), onChange: val => { setting_item_text_arr[(amount - 1) * 2 + 1].text = val }
      })
      setting_modal.addChild(input_element_wrapper2)
      input_element_wrapper.position.set(180, (amount - 1) * 80 + 150)
      input_element_wrapper2.position.set(470, (amount - 1) * 80 + 150)
    }
    const slider_sprite = getSliderSprite()
    slider_sprite.position.set(400, 60)
    setting_modal.addChild(slider_sprite)
    const inputText = new PIXI.Text('Volume', { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff });
    inputText.position.set(260, 45)
    setting_modal.addChild(inputText)
    const check_sprite = getCheckSprite()
    check_sprite.position.set(300, 100)
    setting_modal.addChild(check_sprite)

    const close_button_sprite_2 = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-close.png'))
    setting_modal.addChild(close_button_sprite_2)
    close_button_sprite_2.position.set(800, 20)
    close_button_sprite_2.eventMode = 'static';
    close_button_sprite_2.cursor = 'pointer';
    close_button_sprite_2.on('pointerdown', () => {
      tweenTo(setting_modal_wrapper, 'x', 0, 2000, 500, backout(1), null, null)
      tweenTo(setting_modal_wrapper, 'alpha', 1, 0, 500, backout(1), null, null);
    })

    const setting_at_status_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-setting-empty.png'))
    setting_at_status_sprite.position.set(275, 15)
    backgroundFooterSprite.addChild(setting_at_status_sprite)
    setting_at_status_sprite.eventMode = 'static';
    setting_at_status_sprite.cursor = 'pointer';
    const setting_sprite_on_pointerdown = () => {
      display_win_text.alpha = 0
      if (info_dialog_wrapper.alpha === 1) {
        tweenTo(info_dialog_wrapper, 'alpha', 1, 0, 500, backout(1), null, null)
        close_button_sprite.eventMode = 'none'
      }
      if (setting_modal_wrapper.x === 0) {
        tweenTo(setting_modal_wrapper, 'x', 0, 2000, 500, backout(1), null, null)
        tweenTo(setting_modal_wrapper, 'alpha', 1, 0, 500, backout(1), null, null);
      }
      else if (setting_modal_wrapper.x === 2000) {
        tweenTo(setting_modal_wrapper, 'x', 2000, 0, 500, backout(1), null, null)
        tweenTo(setting_modal_wrapper, 'alpha', 0, 1, 500, backout(1), null, null);
      }
    }
    setting_at_status_sprite.on('pointerdown', setting_sprite_on_pointerdown).on('pointerover', () => {
      setting_at_status_sprite.texture = PIXI.Texture.from('/assets/image/button-setting.png')
    }).on('pointerout', () => {
      setting_at_status_sprite.texture = PIXI.Texture.from('/assets/image/button-setting-empty.png')
    })

    const auto_spin_wrapper = new PIXI.Container()
    auto_spin_wrapper.eventMode = 'static'
    auto_spin_wrapper.scale.set(0)
    auto_spin_wrapper.pivot.set(450, 250)
    const outer_bg_auto_spin_wrap = new PIXI.Graphics()
    outer_bg_auto_spin_wrap.lineStyle(0);
    outer_bg_auto_spin_wrap.beginFill(0x222222, 0.01).drawRect(-4000, -4000, 8000, 8000);
    outer_bg_auto_spin_wrap.eventMode = 'static';
    outer_bg_auto_spin_wrap.cursor = 'pointer';
    outer_bg_auto_spin_wrap.on('pointerdown', (event) => {
      if (event.target === outer_bg_auto_spin_wrap) {
        if (auto_spin_wrapper.scale.x !== 0) {
          tweenTo(auto_spin_wrapper.scale, 'x', 1, 0, 500, backout(1), null, null)
          tweenTo(auto_spin_wrapper.scale, 'y', 1, 0, 500, backout(1), null, null)
        }
      }
    })
    auto_spin_wrapper.addChild(outer_bg_auto_spin_wrap)
    const bg_auto_spin_wrap = new PIXI.Graphics()
    bg_auto_spin_wrap.lineStyle(0);
    bg_auto_spin_wrap.beginFill(0x222222, 1).drawRoundedRect(0, 0, 450, 250, 5);
    auto_spin_wrapper.addChild(bg_auto_spin_wrap)
    const autospin_static_text = new PIXI.Text("Autospin Settings", { fontFamily: 'Arial', fontSize: 42, fill: 0xffffff });
    autospin_static_text.position.set(20, 10)
    auto_spin_wrapper.addChild(autospin_static_text)
    const autospin_static_text_2 = new PIXI.Text("Number of Rounds", { fontFamily: 'Arial', fontSize: 28, fill: 0x888888 });
    autospin_static_text_2.position.set(20, 64)
    auto_spin_wrapper.addChild(autospin_static_text_2)

    const auto_spin_item_arr_1 = [10, 25, 50, 100, 250]
    auto_spin_item_arr_1.forEach((item, i) => {
      const button_auto_spin_item = gen_autospin_item(String(item))
      button_auto_spin_item.position.set(20 + i * 80, 110)
      button_auto_spin_item.eventMode = 'static';
      button_auto_spin_item.cursor = 'pointer';
      button_auto_spin_item.on('pointerdown', () => {
        auto_spin_val = item
        startPlay()
        tweenTo(auto_spin_wrapper.scale, 'x', 1, 0, 500, backout(1), null, null)
        tweenTo(auto_spin_wrapper.scale, 'y', 1, 0, 500, backout(1), null, null)
      })
      auto_spin_wrapper.addChild(button_auto_spin_item)
    })
    const auto_spin_item_arr_2 = [500, 750, 1000, -1]
    auto_spin_item_arr_2.forEach((item, i) => {
      const button_auto_spin_item = gen_autospin_item(item > 0 ? String(item) : "∞")
      button_auto_spin_item.position.set(60 + i * 80, 170)
      button_auto_spin_item.eventMode = 'static';
      button_auto_spin_item.cursor = 'pointer';
      button_auto_spin_item.on('pointerdown', () => {
        auto_spin_val = item
        startPlay()
        tweenTo(auto_spin_wrapper.scale, 'x', 1, 0, 500, backout(1), null, null)
        tweenTo(auto_spin_wrapper.scale, 'y', 1, 0, 500, backout(1), null, null)
      })
      auto_spin_wrapper.addChild(button_auto_spin_item)
    })
    backgroundFooterSprite.addChild(auto_spin_wrapper)
    const button_auto_spin_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-auto-spin-empty.png'))
    button_auto_spin_sprite.position.set(1460, 35)
    button_auto_spin_sprite.eventMode = 'static';
    button_auto_spin_sprite.cursor = 'pointer';
    const button_auto_spin_sprite_on_pointerdown = () => {
      if (auto_spin_val > 0 || auto_spin_val === -1) {
        auto_spin_val = 0
        auto_spin_val_text_sprite.text = ""
        button_auto_spin_sprite.texture = PIXI.Texture.from('/assets/image/button-auto-spin-empty.png')
        button_mobile_A.texture = PIXI.Texture.from('/assets/image/button-mobile-A.png')
      } else {
        const scale = app.screen.width > app.screen.height * critical_ratio ? 1 : 2
        if (auto_spin_wrapper.scale.x === 0) {
          tweenTo(auto_spin_wrapper.scale, 'x', 0, scale, 500, backout(1), null, null)
          tweenTo(auto_spin_wrapper.scale, 'y', 0, scale, 500, backout(1), null, null)
        } else //if (auto_spin_wrapper.scale.x === 1)
        {
          tweenTo(auto_spin_wrapper.scale, 'x', scale, 0, 500, backout(1), null, null)
          tweenTo(auto_spin_wrapper.scale, 'y', scale, 0, 500, backout(1), null, null)
        }
      }
      const scale = app.screen.width > app.screen.height * critical_ratio ? 1 : 2
      if (setting_modal_wrapper.position.x === 0) {
        tweenTo(setting_modal_wrapper, 'x', 0, 2000, 500, backout(1), null, null);
        tweenTo(setting_modal_wrapper, 'alpha', 1, 0, 500, backout(1), null, null);
      }
      if (info_dialog_wrapper.alpha === 1) {
        tweenTo(info_dialog_wrapper, 'alpha', 1, 0, 500, backout(1), null, null)
        close_button_sprite.eventMode = 'none'
      }
      if (settings_list_sprite.scale.x !== 0) {
        tweenTo(settings_list_sprite.scale, 'x', scale, 0, 200, backout(1.2), null, null)
        tweenTo(settings_list_sprite.scale, 'y', scale, 0, 200, backout(1), null, null)
        tweenTo(settings_list_sprite, 'alpha', 1, 0, 200, backout(1), null, null)
      }
      if (auto_spin_wrapper.scale.x !== 0) {
        tweenTo(auto_spin_wrapper.scale, 'x', scale, 0, 500, backout(1), null, null)
        tweenTo(auto_spin_wrapper.scale, 'y', scale, 0, 500, backout(1), null, null)
      }

      if (bline_list_sprite.scale.x !== 0) {
        tweenTo(bline_list_sprite.scale, 'x', scale, 0, 500, backout(1), null, null)
        tweenTo(bline_list_sprite.scale, 'y', scale, 0, 500, backout(1), null, null)
      }
    }
    button_auto_spin_sprite.on('pointerdown', button_auto_spin_sprite_on_pointerdown)
    backgroundFooterSprite.addChild(button_auto_spin_sprite);
    const auto_spin_val_text_sprite = new PIXI.Text("", { fontFamily: 'Arial', fontSize: 28, fill: 0xffffff });
    auto_spin_val_text_sprite.anchor.set(0.5)
    backgroundFooterSprite.addChild(auto_spin_val_text_sprite);

    const button_spin_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-spin-empty.png'))
    button_spin_sprite.position.set(1547, 25)
    button_spin_sprite.eventMode = 'static';
    button_spin_sprite.cursor = 'pointer';
    button_spin_sprite.on('pointerdown', () => {
      startPlay()
    }).on('pointerover', () => {
      button_spin_sprite.texture = PIXI.Texture.from('/assets/image/button-spin.png')
    }).on('pointerout', () => {
      button_spin_sprite.texture = PIXI.Texture.from('/assets/image/button-spin-empty.png')
    })
    backgroundFooterSprite.addChild(button_spin_sprite);



    const settings_list_sprite = new PIXI.Sprite()

    backgroundFooterSprite.addChild(settings_list_sprite)
    const bg_setting_list_sprite = new PIXI.Graphics()
    bg_setting_list_sprite.eventMode = 'static'
    bg_setting_list_sprite.cursor = 'pointer';
    bg_setting_list_sprite.on('pointerdown', (event) => {
      if (event.target === bg_setting_list_sprite) {
        const scale = app.screen.width > app.screen.height * critical_ratio ? 1 : 2
        tweenTo(settings_list_sprite.scale, 'x', scale, 0, 200, backout(1), null, null)
        tweenTo(settings_list_sprite.scale, 'y', scale, 0, 200, backout(1), null, null)
        tweenTo(settings_list_sprite, 'alpha', 1, 0, 200, backout(1), null, null)
      }
    });
    settings_list_sprite.addChild(bg_setting_list_sprite)
    bg_setting_list_sprite.lineStyle(0);
    bg_setting_list_sprite.beginFill(0x222222, 0.01).drawRect(-670, -300, 2500, 1260);


    settings_list_sprite.pivot.set(120, 560)
    settings_list_sprite.scale.set(0)
    const settings_list_sprite_bg_arr: { setting_item_sprite: PIXI.Container, bg_setting_item: PIXI.Graphics, setting_item_text: string }[] = []
    for (let i = 0; i < 14; i++) {
      const setting_item_sprite = new PIXI.Container()
      settings_list_sprite.addChild(setting_item_sprite)
      const bg_setting_item = new PIXI.Graphics()
      setting_item_sprite.addChild(bg_setting_item)
      settings_list_sprite_bg_arr.push({ setting_item_sprite, bg_setting_item, setting_item_text: String((i + 1) * 100) })
      bg_setting_item.lineStyle(0);
      bg_setting_item.beginFill(0x222222, 1).drawRect(0, 0, 200, 40);
      const setting_item_text = new PIXI.Text(String((i + 1) * 100), { fontFamily: 'Arial', fontSize: 28, fill: 0xffffff });
      setting_item_text.position.set(100, 20)
      setting_item_text.anchor.set(0.5)
      setting_item_sprite.addChild(setting_item_text)
      setting_item_text_arr.push(setting_item_text)

      setting_item_sprite.eventMode = 'static';
      setting_item_sprite.cursor = 'pointer';
      setting_item_sprite.on('pointerdown', () => {
        bet_text.text = setting_item_text.text
        total_bet_text.text = String(parseInt(bline_val_text.text) * parseInt(setting_item_text.text))

        const scale = app.screen.width > app.screen.height * critical_ratio ? 1 : 2
        tweenTo(settings_list_sprite.scale, 'x', scale, 0, 200, backout(1), null, null)
        tweenTo(settings_list_sprite.scale, 'y', scale, 0, 200, backout(1), null, null)
        tweenTo(settings_list_sprite, 'alpha', 1, 0, 200, backout(1), null, null)
        for (const item of settings_list_sprite_bg_arr) {
          item.setting_item_sprite.eventMode = 'static';
          item.bg_setting_item.beginFill(0x222222, 1).drawRect(0, 0, 200, 40);
        }

        setting_item_sprite.eventMode = 'none';
        bg_setting_item.beginFill(0x000000, 1).drawRect(0, 0, 200, 40);
      }).on('pointerover', () => {
        bg_setting_item.beginFill(0x333333, 1).drawRect(0, 0, 200, 40);
      }).on('pointerout', () => {
        bg_setting_item.beginFill(0x222222, 1).drawRect(0, 0, 200, 40);
      })

      setting_item_sprite.position.set(0, 40 * (13 - i))
    }











    const display_win_text = new PIXI.Text('', winTextStyle);
    appStage.addChild(display_win_text)
    display_win_text.anchor.set(0.5)
    display_win_text.position.set(960, 480)
    display_win_text.alpha = 0

    const button_wallet_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-wallet-empty.png'))
    button_wallet_sprite.position.set(334, 15)
    backgroundFooterSprite.addChild(button_wallet_sprite)
    button_wallet_sprite.eventMode = 'static';
    button_wallet_sprite.cursor = 'pointer';
    button_wallet_sprite.on('pointerdown', () => {
      navigate('/show-history')
    }).on('pointerover', () => {
      button_wallet_sprite.texture = PIXI.Texture.from('/assets/image/button-wallet.png')
    }).on('pointerout', () => {
      button_wallet_sprite.texture = PIXI.Texture.from('/assets/image/button-wallet-empty.png')
    })

    const button_bet_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-bet.png'))
    button_bet_sprite.position.set(550, 10)
    backgroundFooterSprite.addChild(button_bet_sprite)
    button_bet_sprite.eventMode = 'static';
    button_bet_sprite.cursor = 'pointer';
    const button_bet_sprite_on_pointerdown = () => {

      const scale = app.screen.width > app.screen.height * critical_ratio ? 1 : 2
      if (setting_modal_wrapper.position.x === 0) {
        tweenTo(setting_modal_wrapper, 'x', 0, 2000, 500, backout(1), null, null);
        tweenTo(setting_modal_wrapper, 'alpha', 1, 0, 500, backout(1), null, null);
      }
      if (info_dialog_wrapper.alpha === 1) {
        tweenTo(info_dialog_wrapper, 'alpha', 1, 0, 500, backout(1), null, null)
        close_button_sprite.eventMode = 'none'
      }
      if (auto_spin_wrapper.scale.x !== 0) {
        tweenTo(auto_spin_wrapper.scale, 'x', scale, 0, 500, backout(1), null, null)
        tweenTo(auto_spin_wrapper.scale, 'y', scale, 0, 500, backout(1), null, null)
      }
      if (bline_list_sprite.scale.x !== 0) {
        tweenTo(bline_list_sprite.scale, 'x', scale, 0, 500, backout(1), null, null)
        tweenTo(bline_list_sprite.scale, 'y', scale, 0, 500, backout(1), null, null)
      }

      if (settings_list_sprite.scale.x == 0) {
        tweenTo(settings_list_sprite.scale, 'x', 0, scale, 300, backout(1.3), null, null)
        tweenTo(settings_list_sprite.scale, 'y', 0, scale, 300, backout(1.3), null, null)
        tweenTo(settings_list_sprite, 'alpha', 0, 1, 200, backout(1), null, null)
      } else //if (settings_list_sprite.scale.x == scale) 
      {
        tweenTo(settings_list_sprite.scale, 'x', scale, 0, 200, backout(1.2), null, null)
        tweenTo(settings_list_sprite.scale, 'y', scale, 0, 200, backout(1), null, null)
        tweenTo(settings_list_sprite, 'alpha', 1, 0, 200, backout(1), null, null)
      }
      for (const item of settings_list_sprite_bg_arr) {
        if (item.setting_item_text === bet_text.text) {
          item.setting_item_sprite.eventMode = 'none';
          item.bg_setting_item.beginFill(0x000000, 1).drawRect(0, 0, 200, 40);
        } else {
          item.setting_item_sprite.eventMode = 'static';
          item.bg_setting_item.beginFill(0x222222, 1).drawRect(0, 0, 200, 40);
        }
      }
    }
    button_bet_sprite.on('pointerdown', button_bet_sprite_on_pointerdown)
    const bet_up_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-up-down.png'))
    bet_up_sprite.position.set(785, 18)
    backgroundFooterSprite.addChild(bet_up_sprite)
    bet_up_sprite.eventMode = 'static';
    bet_up_sprite.cursor = 'pointer';
    bet_up_sprite.on('pointerdown', () => {
      const cur_index = setting_item_text_arr.findIndex((elem) => (elem.text.trim() === bet_text.text.trim()))
      bet_text.text = setting_item_text_arr[Math.min(cur_index + 1, setting_item_text_arr.length - 1)].text;
      total_bet_text.text = String(parseInt(bline_val_text.text) * parseInt(bet_text.text))
    })
    const bet_down_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-up-down.png'))
    bet_down_sprite.position.set(785, 61)
    backgroundFooterSprite.addChild(bet_down_sprite)
    bet_down_sprite.eventMode = 'static';
    bet_down_sprite.cursor = 'pointer';
    bet_down_sprite.on('pointerdown', () => {
      const cur_index = setting_item_text_arr.findIndex((elem) => (elem.text.trim() === bet_text.text.trim()))
      bet_text.text = setting_item_text_arr[Math.max(cur_index - 1, 0)].text
      total_bet_text.text = String(parseInt(bline_val_text.text) * parseInt(bet_text.text))
    })
    const bline_wrapper = new PIXI.Container()



    const button_bline_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-bet.png'))
    button_bline_sprite.position.set(-60, -70)
    button_bline_sprite.scale.set(0.8, 1)
    bline_wrapper.addChild(button_bline_sprite)
    button_bline_sprite.eventMode = 'static';
    button_bline_sprite.cursor = 'pointer';
    const button_bline_sprite_on_pointerdown = () => {

      const scale = app.screen.width > app.screen.height * critical_ratio ? 1 : 2
      if (setting_modal_wrapper.position.x === 0) {
        tweenTo(setting_modal_wrapper, 'x', 0, 2000, 500, backout(1), null, null);
        tweenTo(setting_modal_wrapper, 'alpha', 1, 0, 500, backout(1), null, null);
      }
      if (info_dialog_wrapper.alpha === 1) {
        tweenTo(info_dialog_wrapper, 'alpha', 1, 0, 500, backout(1), null, null)
        close_button_sprite.eventMode = 'none'
      }
      if (settings_list_sprite.scale.x !== 0) {
        tweenTo(settings_list_sprite.scale, 'x', scale, 0, 200, backout(1.2), null, null)
        tweenTo(settings_list_sprite.scale, 'y', scale, 0, 200, backout(1), null, null)
        tweenTo(settings_list_sprite, 'alpha', 1, 0, 200, backout(1), null, null)
      }
      if (auto_spin_wrapper.scale.x !== 0) {
        tweenTo(auto_spin_wrapper.scale, 'x', scale, 0, 500, backout(1), null, null)
        tweenTo(auto_spin_wrapper.scale, 'y', scale, 0, 500, backout(1), null, null)
      }

      if (bline_list_sprite.scale.x === 0) {
        tweenTo(bline_list_sprite.scale, 'x', 0, scale, 200, backout(1.2), null, null)
        tweenTo(bline_list_sprite.scale, 'y', 0, scale, 200, backout(1.2), null, null)
      } else {
        tweenTo(bline_list_sprite.scale, 'x', scale, 0, 500, backout(1), null, null)
        tweenTo(bline_list_sprite.scale, 'y', scale, 0, 500, backout(1), null, null)
      }
      for (const item of bline_list_sprite_bg_arr) {
        if (item.bline_item_text === bline_val_text.text) {
          item.bline_item_sprite.eventMode = 'none';
          item.bg_bline_list_item.beginFill(0x000000, 1).drawRect(0, 0, 200, 40);
        } else {
          item.bline_item_sprite.eventMode = 'static';
          item.bg_bline_list_item.beginFill(0x222222, 1).drawRect(0, 0, 200, 40);
        }
      }
    }
    button_bline_sprite.on('pointerdown', button_bline_sprite_on_pointerdown)




    bline_wrapper.position.set(1730, 80)//1730, 920

    const bline_static_text = new PIXI.Text('Line', { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff });
    bline_static_text.anchor.set(0.5)
    bline_wrapper.addChild(bline_static_text)
    const bline_dec_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-up-down.png'))
    bline_dec_sprite.position.set(135, -5)
    bline_wrapper.addChild(bline_dec_sprite)
    const bline_inc_sprite = new PIXI.Sprite(PIXI.Texture.from('/assets/image/button-up-down.png'))
    bline_inc_sprite.position.set(135, -60)
    bline_wrapper.addChild(bline_inc_sprite)


    const bline_val_text = new PIXI.Text('1', { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff });
    bline_val_text.anchor.set(0.5)
    bline_wrapper.addChild(bline_val_text)
    bline_inc_sprite.eventMode = 'static';
    bline_inc_sprite.cursor = 'pointer';
    bline_inc_sprite.on('pointerdown', () => {
      const cur_bline = parseInt(bline_val_text.text)
      let new_bline = Math.min(cur_bline + 1, 20)
      bline_val_text.text = new_bline
      total_bet_text.text = String(new_bline * parseInt(bet_text.text))
    })
    bline_dec_sprite.eventMode = 'static';
    bline_dec_sprite.cursor = 'pointer';
    bline_dec_sprite.on('pointerdown', () => {
      const cur_bline = parseInt(bline_val_text.text)
      let new_bline = Math.max(cur_bline - 1, 1)
      bline_val_text.text = new_bline
      total_bet_text.text = String(new_bline * parseInt(bet_text.text))
    })
    backgroundFooterSprite.addChild(bline_wrapper);
    // appStage.addChild(bline_wrapper)

    // ! bline mobile list sprite
    const bline_list_sprite = new PIXI.Sprite()
    bline_list_sprite.pivot.set(200, 800)
    bline_list_sprite.scale.set(0)
    backgroundFooterSprite.addChild(bline_list_sprite)
    const bg_bline_list_sprite = new PIXI.Graphics()
    bg_bline_list_sprite.eventMode = 'static'
    bg_bline_list_sprite.cursor = 'pointer';
    bg_bline_list_sprite.on('pointerdown', (event) => {
      if (event.target === bg_bline_list_sprite) {
        tweenTo(bline_list_sprite.scale, 'x', 1, 0, 500, backout(1), null, null)
        tweenTo(bline_list_sprite.scale, 'y', 1, 0, 500, backout(1), null, null)
      }
    });
    bline_list_sprite.addChild(bg_bline_list_sprite)
    bg_bline_list_sprite.lineStyle(0);
    bg_bline_list_sprite.beginFill(0x222222, 0.01).drawRect(-670, -300, 2600, 1120);
    const bline_list_sprite_bg_arr: { bline_item_sprite: PIXI.Container, bg_bline_list_item: PIXI.Graphics, bline_item_text: string }[] = []
    for (let i = 0; i < 20; i++) {
      const bline_item_sprite = new PIXI.Container()
      bline_list_sprite.addChild(bline_item_sprite)
      const bg_bline_list_item = new PIXI.Graphics()
      bline_item_sprite.addChild(bg_bline_list_item)
      bline_list_sprite_bg_arr.push({ bline_item_sprite, bg_bline_list_item, bline_item_text: String((i + 1)) })
      bg_bline_list_item.lineStyle(0);
      bg_bline_list_item.beginFill(0x222222, 1).drawRect(0, 0, 200, 40);
      const bline_item_text = new PIXI.Text(String((i + 1)), { fontFamily: 'Arial', fontSize: 28, fill: 0xffffff });
      bline_item_text.position.set(100, 20)
      bline_item_text.anchor.set(0.5)
      bline_item_sprite.addChild(bline_item_text)
      setting_item_text_arr.push(bline_item_text)

      bline_item_sprite.eventMode = 'static';
      bline_item_sprite.cursor = 'pointer';
      bline_item_sprite.on('pointerdown', () => {
        bline_val_text.text = bline_item_text.text
        total_bet_text.text = String(parseInt(bline_val_text.text) * parseInt(bet_text.text))
        const scale = app.screen.width > app.screen.height * critical_ratio ? 1 : 1.5
        tweenTo(bline_list_sprite.scale, 'x', scale, 0, 500, backout(1), null, null)
        tweenTo(bline_list_sprite.scale, 'y', scale, 0, 500, backout(1), null, null)

        for (const item of bline_list_sprite_bg_arr) {
          item.bline_item_sprite.eventMode = 'static';
          item.bg_bline_list_item.beginFill(0x222222, 1).drawRect(0, 0, 200, 40);
        }

        bline_item_sprite.eventMode = 'none';
        bg_bline_list_item.beginFill(0x000000, 1).drawRect(0, 0, 200, 40);

      }).on('pointerover', () => {
        bg_bline_list_item.beginFill(0x333333, 1).drawRect(0, 0, 200, 40);
      }).on('pointerout', () => {
        bg_bline_list_item.beginFill(0x222222, 1).drawRect(0, 0, 200, 40);
      })

      bline_item_sprite.position.set(0, 40 * (19 - i))
    }
    // ! bline mobile list sprite
    (Global_Store.info_dialog_wrapper_resize_callback = function () {
      const APP_SCALE = Math.min(app.screen.width / App_Dimension.width, app.screen.height / App_Dimension.height)
      info_dialog_wrapper.scale.set(APP_SCALE)
      info_dialog_wrapper.x = (app.screen.width - App_Dimension.width * APP_SCALE) / 2
      // info_dialog_wrapper.y = (app.screen.height - App_Dimension.height * APP_SCALE) / 2
      backgroundFooterSprite.scale.set(APP_SCALE)
      const control_pos_web = (app.screen.width < app.screen.height * critical_ratio) ? backgroundFooterSprite.height : 0
      backgroundFooterSprite.position.set((app.screen.width - App_Dimension.width * APP_SCALE) / 2, app.screen.height - backgroundFooterSprite.height + control_pos_web)
      // ! backgroundFooterSprite.position.set(-100, app.screen.height * (1 + APP_SCALE) / 2 / APP_SCALE - backgroundFooterSprite.height)
      mobile_background_header_sprite.scale.set(app.screen.width / 750)
      mobile_background_footer_sprite.scale.set(Math.min(1, app.screen.width / 750))

      const control_pos_mobile = (app.screen.width > app.screen.height * critical_ratio) ? mobile_background_footer_sprite.height * 4 : 0
      mobile_background_footer_sprite.position.set((app.screen.width - mobile_background_footer_sprite.width) / 2, app.screen.height - mobile_background_footer_sprite.height + control_pos_mobile)
      mobile_background_header_sprite.position.set((app.screen.width - App_Dimension.width * APP_SCALE) / 2, -control_pos_mobile)
      if (app.screen.width > app.screen.height * critical_ratio) {
        balance_text.position.set(360, 70)
        balance_text.scale.set(1)
        balance_text_static.position.set(280, 85)
        balance_text_static.scale.set(1)
        bet_text_static.position.set(665, 36)
        bet_text.position.set(665, 80)
        bet_text_static.scale.set(1)
        bet_text.scale.set(1)
        bline_static_text.position.set(0, -50)
        bline_static_text.scale.set(1)
        bline_val_text.position.set(0, 0)
        bline_val_text.scale.set(1)
        total_bet_text.position.set(1280, 80)
        total_bet_text.scale.set(1)
        total_bet_text_static.position.set(1150, 80)
        total_bet_text_static.scale.set(1)
        settings_list_sprite.position.set(670, 0)
        auto_spin_wrapper.position.set(1500, 0)
        auto_spin_val_text_sprite.position.set(1480, 15)
        auto_spin_val_text_sprite.scale.set(1)
        bline_list_sprite.position.set(1850, 0)
        // bline_list_sprite.scale.set(1)
        mobile_win_hold_spin_text_wrapper.position.set(750, 1650)
        setting_modal.scale.set(1)
      } else {
        balance_text.position.set(230 - 100, 70 - 600)
        balance_text.scale.set(2)
        balance_text_static.position.set(280 - 40, 85 - 680)
        balance_text_static.scale.set(2)
        // bet_text_static.position.set(665 + 100, 36 - 530)
        // bet_text.position.set(665 + 250, 80 - 575)
        // bet_text_static.scale.set(2)
        // bet_text.scale.set(2)
        // bline_static_text.position.set(-550, -50 - 525)
        // bline_static_text.scale.set(2)
        // bline_val_text.position.set(-450, -575)
        // bline_val_text.scale.set(2)
        total_bet_text.position.set(1600, 80 - 575)
        total_bet_text.scale.set(2)
        total_bet_text_static.position.set(1600, 80 - 675)
        total_bet_text_static.scale.set(2)
        settings_list_sprite.position.set(1400, -350)
        auto_spin_wrapper.position.set(1000, -400)
        auto_spin_val_text_sprite.position.set(540, -360)
        auto_spin_val_text_sprite.scale.set(2)
        bline_list_sprite.position.set(1950, -350)
        // bline_list_sprite.scale.set(1.5)
        mobile_win_hold_spin_text_wrapper.position.set(750, -700)
        setting_modal.scale.set(1.4)
      }

    })()

    const spaceKey: any = keyboard(" ")
    spaceKey.press = startPlay;

    let cur_timing_counter = 0
    async function reelsComplete() {

      const result: Array<Array<number>> = []
      for (let i = 0; i < 5; i++) {
        const reel_arr = []
        const cur_pos = Math.round((reels[i].position + 400) % reels[i].animated_symbols.length)
        for (let j = 1; j < 4; j++) {
          reel_arr.push(reels[i].url_ids[(j - cur_pos + 400) % 4])
        }
        result.push(reel_arr)
      }

      let earned = 0;
      await sleep(1000)
      testContainerSprite.removeChildren()
      for (let i = 0; i < parseInt(bline_val_text.text); i++) {
        const pay_line = pay_table[i]

        let matching = 0
        let cur = 0
        while (matching < 5 && (cur = result[matching][pay_line[matching]]) < 3) matching++;
        matching++;
        while (matching < 5) {
          const reel_result = result[matching][pay_line[matching]]
          if (cur !== reel_result) {
            if (reel_result >= 3) break;
          }
          matching++;
        }
        if (matching > 2) {
          const won_line_number_arr: number[] = []
          let multiply_val = 1;
          for (let j = 0; j < matching; j++) {
            const won_line_number = Math.round(pay_line[j] - reels[j].position + 4000 + 1) % 4;
            // (reels[j].animated_symbols[won_line_number].getChildAt(0) as PIXI.AnimatedSprite).play()
            won_line_number_arr.push(won_line_number)




            // const originalChild = reels[j].animated_symbols[won_line_number].getChildAt(0);
            // originalChild.alpha = 0
            // if (originalChild instanceof PIXI.AnimatedSprite) {
            //   const copiedChild = new PIXI.AnimatedSprite(originalChild.textures);

            //   copiedChild.position.copyFrom(testContainerSprite.toLocal(originalChild.toGlobal(new PIXI.Point())));
            //   copiedChild.scale.set(calculateScale(originalChild).x / appStage.scale.x);
            //   copiedChild.tint = originalChild.tint;

            //   // Copy any necessary children of the original child
            //   // This depends on the structure of your sprites

            //   testContainerSprite.addChild(copiedChild);
            //   // copiedChild.play()
            // }





            const cur_result_item = result[j][pay_line[j]]
            if (cur_result_item == 1 || cur_result_item == 2) multiply_val *= (cur_result_item + 1)

          }
          tweenTo(display_win_text, 'alpha', 0, 1, 500, backout(1), null, null)
          const cur_win = parseInt(bet_text.text) * pay_elems[matching - 3] * multiply_val
          won_lines.push({ won_line_number_arr, multiply_val, pay_line_id: i + 1, cur_win })
          earned += cur_win
        }
      }
      if (earned > 0) {
        win_hold_spin_text.text = "Total Win " + earned
        mobile_win_hold_spin_text_upper.text = "Total Win"
        mobile_win_hold_spin_text_down.text = String(earned)
      }
      last_win = earned
      const slotInfo = {
        id: new Date().getTime(),
        bet: parseInt(total_bet_text.text),
        won_lines,
        blines: parseInt(bline_val_text.text),
        time: new Date()
      }
      const slot_infos: Array<any> = JSON.parse(localStorage.getItem('slotinfo') || '[]')
      slot_infos.unshift(slotInfo)
      localStorage.setItem('slotinfo', JSON.stringify(slot_infos))
      balance_text.text = parseInt(balance_text.text) + earned
      cur_timing_counter = 0
      if (auto_spin_val > 0 || auto_spin_val === -1) {
        if (auto_spin_val > 0) auto_spin_val--;
        if (earned > 0) {
          setTimeout(() => {
            running = false;
            startPlay()
          }, 4000)
        } else {
          running = false;
          startPlay()
        }
      }
      if (auto_spin_val === 0) {
        running = false;
        button_bet_sprite.eventMode = bline_inc_sprite.eventMode = bline_dec_sprite.eventMode = bet_up_sprite.eventMode = bet_down_sprite.eventMode = info_at_statusbarSprite.eventMode = setting_at_status_sprite.eventMode = button_wallet_sprite.eventMode = button_mobile_chip.eventMode = button_mobile_H.eventMode = button_bline_sprite.eventMode = 'static'
      }
    }
    function startPlay() {

      if (running) return;
      if (auto_spin_val > 0) {
        auto_spin_val_text_sprite.text = String(auto_spin_val)
        button_auto_spin_sprite.texture = PIXI.Texture.from('/assets/image/button-auto-spin-stop.png')
        button_mobile_A.texture = PIXI.Texture.from('/assets/image/button-mobile-stop.png')
      } else if (auto_spin_val === -1) {
        auto_spin_val_text_sprite.text = "∞"
        button_auto_spin_sprite.texture = PIXI.Texture.from('/assets/image/button-auto-spin-stop.png')
        button_mobile_A.texture = PIXI.Texture.from('/assets/image/button-mobile-stop.png')
      } else {
        auto_spin_val_text_sprite.text = ""
        button_auto_spin_sprite.texture = PIXI.Texture.from('/assets/image/button-auto-spin-empty.png')
        button_mobile_A.texture = PIXI.Texture.from('/assets/image/button-mobile-A.png')
      }

      running = true;
      prev_won_line_index = -1


      // sound.add('spin-sound','/assets/audio/sfx/spin.mp3');
      // sound.play('spin-sound');
      // sound.volumeAll = 0.5


      if (last_win > 0) {
        win_hold_spin_text.text = "Last Win " + last_win
        mobile_win_hold_spin_text_upper.text = "Last Win"
        mobile_win_hold_spin_text_down.text = String(last_win)
      } else {
        win_hold_spin_text.text = "Hold spin to quick spins"
        mobile_win_hold_spin_text_upper.text = "Hold spin"
        mobile_win_hold_spin_text_down.text = ""
      }
      button_bet_sprite.eventMode = bline_inc_sprite.eventMode = bline_dec_sprite.eventMode = bet_up_sprite.eventMode = bet_down_sprite.eventMode = info_at_statusbarSprite.eventMode = setting_at_status_sprite.eventMode = button_wallet_sprite.eventMode = button_mobile_chip.eventMode = button_mobile_H.eventMode = button_bline_sprite.eventMode = 'none'
      cur_bet_val = parseInt(bet_text.text)
      const scale = app.screen.width > app.screen.height * critical_ratio ? 1 : 2
      if (info_dialog_wrapper.alpha === 1) {
        tweenTo(info_dialog_wrapper, 'alpha', 1, 0, 500, backout(1), null, null)
        close_button_sprite.eventMode = 'none'
      }
      if (display_win_text.alpha === 1) {
        tweenTo(display_win_text, 'alpha', 1, 0, 500, backout(1), null, null)
      }
      if (setting_modal_wrapper.position.x === 0) {
        tweenTo(setting_modal_wrapper, 'x', 0, 2000, 500, backout(1), null, null);
        tweenTo(setting_modal_wrapper, 'alpha', 1, 0, 500, backout(1), null, null);
      }
      if (auto_spin_wrapper.scale.x !== 0) {
        tweenTo(auto_spin_wrapper.scale, 'x', scale, 0, 500, backout(1), null, null)
        tweenTo(auto_spin_wrapper.scale, 'y', scale, 0, 500, backout(1), null, null)
      }
      if (settings_list_sprite.scale.x !== 0) {
        tweenTo(settings_list_sprite.scale, 'x', scale, 0, 200, backout(1.2), null, null)
        tweenTo(settings_list_sprite.scale, 'y', scale, 0, 200, backout(1), null, null)
        tweenTo(settings_list_sprite, 'alpha', 1, 0, 200, backout(1), null, null)
      }

      if (bline_list_sprite.scale.x !== 0) {
        tweenTo(bline_list_sprite.scale, 'x', scale, 0, 500, backout(1), null, null)
        tweenTo(bline_list_sprite.scale, 'y', scale, 0, 500, backout(1), null, null)
      }
      const cur_bal = parseInt(balance_text.text)
      const cur_total_bet = parseInt(total_bet_text.text)
      balance_text.text = String(cur_bal - cur_total_bet)
      testContainerSprite.removeChildren()
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
          const animated_sprite = reels[i].animated_symbols[j].getChildAt(0) as PIXI.AnimatedSprite
          // animated_sprite.stop();
          animated_sprite.alpha = 1
          reels[i].card_backs[j].alpha = 1;
          reels[i].cards[j].alpha = 1
        }
      }

      for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        const extra = Math.floor(Math.random() * 3);
        const target = r.position + 50 + i * 5 + extra;
        const time = 800 + i * 500 + extra * 0;

        tweenTo(r, 'position', r.position, target, time, backout(1.1), null, i === reels.length - 1 ? reelsComplete : null);
        // for (let j = 0; j < 4; j++) {
        //     r.cards[j].alpha = 1
        // }
      }
      won_lines = []
    }
    app.ticker.add(() => {
      for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        r.blur.blurX = (r.position - r.previousPosition) * 1;
        r.blur.blurY = (r.position - r.previousPosition) * 0;
        for (let j = 0; j < r.animated_symbols.length; j++) {
          const s = r.animated_symbols[j];
          const c = r.cards[j];
          const rel_position = (r.position + j) % r.animated_symbols.length
          const relativePositionY = rel_position * App_Dimension.cardHeight;
          const globalPosition = c.toGlobal(new PIXI.Point(0, relativePositionY));
          c.position = (c.toLocal(globalPosition))
          if (rel_position < 1 && (r.previousPosition + j) % r.animated_symbols.length > 3) {
            let url_id = Math.floor(Math.random() * slotAnimateUrls.length)
            let compens_arr: number[] = []
            if (i == 0) compens_arr = [1, 2]
            if (i == 1 || i == 4) compens_arr = [0, 1, 2]
            while (compens_arr.includes(url_id)) url_id = Math.floor(Math.random() * slotAnimateUrls.length)
            s.removeChildren()
            s.addChild(gen_card_animated_sprite(slotAnimateUrls[url_id]))
            r.url_ids[j] = url_id
          }
        }
        r.previousPosition = r.position;
      }
    });
    app.ticker.add((delta) => {

      const count = 2
      cur_timing_counter += delta / 20

      if (won_lines.length === 0) {
        return
      }
      for (let i = 0; i < reels.length; i++) {
        for (let j = 0; j < 4; j++) {
          reels[i].cards[j].alpha = 0.2;
          reels[i].card_backs[j].alpha = 1;
          (reels[i].animated_symbols[j].getChildAt(0) as PIXI.AnimatedSprite).alpha = 1
        }
      }
      const won_line_index = Math.floor(cur_timing_counter / Math.PI / 2) % won_lines.length
      const won_line = won_lines[won_line_index]

      display_win_text.text = cur_bet_val * pay_elems[won_line.won_line_number_arr.length - 3] + (won_line.multiply_val === 1 ? " " : " X " + won_line.multiply_val)
      if (won_line_index !== prev_won_line_index) {
        testContainerSprite.removeChildren()
      }
      for (let j = 0; j < won_line.won_line_number_arr.length; j++) {
        reels[j].cards[won_line.won_line_number_arr[j]].alpha = 1;//(Math.sin(cur_timing_counter) + 4) / 5 + 0.5
        const symbol = reels[j].animated_symbols[won_line.won_line_number_arr[j]].getChildAt(0) as PIXI.AnimatedSprite
        // if (!symbol.playing) {
        //   symbol.play()
        // }
        symbol.alpha = 0
        reels[j].card_backs[won_line.won_line_number_arr[j]].alpha = (Math.sin(cur_timing_counter * count) + 4) / 5


        if (won_line_index !== prev_won_line_index) {
          // const pay_line = pay_table[won_line_index]
          // const won_line_number = Math.round(pay_line[j] - reels[j].position + 4000 + 1) % 4;
          const originalChild = reels[j].animated_symbols[won_line.won_line_number_arr[j]].getChildAt(0);
          originalChild.alpha = 0
          if (originalChild instanceof PIXI.AnimatedSprite) {
            const copiedChild = new PIXI.AnimatedSprite(originalChild.textures);

            copiedChild.position.copyFrom(testContainerSprite.toLocal(originalChild.toGlobal(new PIXI.Point())));
            copiedChild.scale.set(calculateScale(originalChild).x / appStage.scale.x);
            copiedChild.tint = originalChild.tint;

            testContainerSprite.addChild(copiedChild);
            copiedChild.animationSpeed = 0.5
            copiedChild.play()
          }
        }






      }
      prev_won_line_index = won_line_index
      // })
    });

    // app.ticker.add((delta) => {

    //   const count = 2
    //   cur_timing_counter += delta / 20
    //   for (let i = 0; i < reels.length; i++) {
    //     for (let j = 0; j < 4; j++) {
    //       reels[i].cards[j].alpha = 1
    //     }
    //   }
    //   if (won_lines.length === 0) return
    //   // won_lines.forEach(won_line => {

    //   const won_line = won_lines[Math.floor(cur_timing_counter / Math.PI / 2) % won_lines.length]
    //   display_win_text.text = cur_bet_val * pay_elems[won_line.won_line_number_arr.length - 3] + (won_line.multiply_val === 1 ? " " : "X" + won_line.multiply_val)
    //   for (let j = 0; j < won_line.won_line_number_arr.length; j++) {
    //     reels[j].cards[won_line.won_line_number_arr[j]].alpha = (Math.cos(cur_timing_counter * count) + 4) / 5
    //   }
    //   // })
    // });
  }


  app.ticker.add(() => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
      const t = tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);
      t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
      if (t.change) t.change(t);
      if (phase === 1) {
        t.object[t.property] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    }
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1);
    }
  });

  let running = false;
  // Game Loop.
  app.ticker.add((deltaTime: number) => loop(deltaTime, true));
  return (
    <div>

    </div>
  )
}
export default GamePIXI;